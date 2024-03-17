import mongoose from "mongoose";
import { Request, Response } from "express";
import { Post } from "../../models/postModel";
import { User } from "../../models/userModel";
import { generateSummary } from "../../utils/relevanceCalculator";
import { Status } from "../../enums/posts/status";

import { body, validationResult, CustomValidator } from "express-validator";

export class PostController {
  // Custom validator to check if the user belongs to the community
  userBelongsToCommunity: CustomValidator = async (community, { req }) => {
    const authorId = req.user?._id;
    if (!authorId) {
      throw new Error("User is not authenticated");
    }

    const user = await User.findById(authorId);
    if (!user || !user.communities.includes(community)) {
      throw new Error("User does not belong to the community");
    }
  };

  // Validation middleware for creating a post
  validatePostCreation = [
    body("title").isString().withMessage("Title must be a string"),
    body("body").isString().withMessage("Body must be a string"),
    body("community")
      .isString()
      .withMessage("Community must be a string")
      .custom(this.userBelongsToCommunity),
    body("summary")
      .optional()
      .isString()
      .withMessage("Summary must be a string if provided"),
  ];

  public createPost = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // You could add more logic here to handle different types of errors distinctly
        const isCommunityError = errors
          .array()
          .some(
            (error) => error.msg === "User does not belong to the community"
          );
        if (isCommunityError) {
          return res.status(403).json({ errors: errors.array() });
        }
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, body, community } = req.body;
      const author = req.user?._id;

      let { summary } = req.body;
      if (!summary) {
        summary = generateSummary(body);
      }

      const newPost = new Post({
        title,
        summary,
        body,
        author,
        community,
        status: Status.PendingApproval,
      });

      await newPost.save();
      res.status(201).json(newPost);
    } catch (error: any) {
      console.error(error);
      res.status(500).send("An error occurred while creating the post");
    }
  };

  public approvePost = async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $set: { status: Status.Approved } },
        { new: true } // returns the updated document
      );

      if (!updatedPost) {
        return res.status(404).send("Post not found");
      }
      res.send(updatedPost);
    } catch (error: any) {
      console.error(error);
      res.status(500).send("An error occurred while creating the post");
    }
  };

  public getFeed = async (req: Request, res: Response) => {
    try {
      const id = req.user?._id;
      const user = await User.findById(id);

      if (!user || user.role !== "super moderator") {
        console.error("User not found or Role is not super moderator");
        return res
          .status(404)
          .send("An error occurred while fetching the feed");
      }

      let { page = "1", pageSize = "10" } = req.query;

      // Convert query string parameters to numbers
      const pageNum = parseInt(page as string, 10) || 1;
      const pageSizeNum = parseInt(pageSize as string, 10) || 10;
      const skip = (pageNum - 1) * pageSizeNum;

      const LIKE_WEIGHT = 0.8;
      const LENGTH_WEIGHT = 0.2;
      const userCountry = user.country; // Assuming the country is directly on the user object

      const pipeline: mongoose.PipelineStage[] = [
        {
          $match: {
            community: { $in: user.communities },
            status: Status.Approved,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "authorDetails"
          }
        },
        {
          $lookup: {
            from: "communities",
            localField: "community",
            foreignField: "_id",
            as: "communityDetails"
          }
        },
        {
          $addFields: {
            likeScore: {
              $multiply: [
                { $divide: ["$likes", "$avgLikes"] }, // Placeholder, will replace with actual value after
                LIKE_WEIGHT,
              ],
            },
            lengthScore: {
              $multiply: [
                { $divide: [{ $strLenCP: "$body" }, "$avgBodyLength"] }, // Placeholder, will replace with actual value after
                LENGTH_WEIGHT,
              ],
            },
            countryPriority: {
              $cond: [{ $eq: ["$author.country", userCountry] }, 1000, 0],
            },
          },
        },
        {
          $addFields: {
            finalScore: {
              $add: ["$likeScore", "$lengthScore", "$countryPriority"],
            },
          },
        },
        { $sort: { finalScore: -1 } },
        { $skip: skip },
        { $limit: pageSizeNum },
        {
          $project: {
            title: 1,
            summary: 1,
            authorDetails: 1,
            communityDetails:1,
            createdAt: 1,
          },
        },
      ];

      // Execute the aggregation pipeline
      const posts = await Post.aggregate(pipeline).exec();

      // Count total documents for pagination
      const total = await Post.countDocuments({
        community: { $in: user.communities },
        status: Status.Approved,
      }).exec();

      res
        .status(200)
        .json({ posts, total, page: pageNum, pageSize: pageSizeNum });
    } catch (error: any) {
      console.error(error);
      res.status(500).send("An error occurred while fetching the feed");
    }
  };
}
