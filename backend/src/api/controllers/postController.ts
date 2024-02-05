import { Request, Response } from 'express';
import { Post } from '../../models/postModel';
import { User } from '../../models/userModel';
import { generateSummary ,calculateRelevanceScore } from '../../utils/relevanceCalculator';
import { Status } from '../../enums/posts/status';
import { convertToNumber } from '../../utils/converts';
import mongoose from 'mongoose';

export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, body, community } = req.body;
        const author = req.user?._id;
        const user = await User.findById(author);
        if (!user || !user.communities.includes(community)) {
            console.error('User does not belong to the community');
            return res.status(403).send('An error occurred while creating the post');
        }

        let { summary } = req.body;
        if (!summary) {
            summary = generateSummary(body);
        }

        if (typeof title !== 'string' || typeof body !== 'string' || typeof author !== 'string' || typeof community !== 'string') {
            return res.status(400).send('Invalid input data');
        }

        const newPost = new Post({
            title,
            summary,
            body,
            author,
            community,
            status: Status.PendingApproval
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error:any) {
        console.error(error);
        res.status(500).send('An error occurred while creating the post');
    }
};

export const approvePost = async (req: Request, res: Response) => {
    const { postId } = req.params;
  
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        postId ,
        { $set: { status: Status.Approved} },
        { new: true } // returns the updated document
      );
  
      if (!updatedPost) {
        return res.status(404).send('Post not found');
      }
      res.send(updatedPost);
    } catch (error:any) {
        console.error(error);
        res.status(500).send('An error occurred while creating the post');
    }
};

export const getFeed = async (req: Request, res: Response) => {
    try {
        const id = req.user?._id;
        const user = await User.findById(id);

        if (!user || user.role !== 'super moderator') {
            console.error('User not found or Role is not super moderator');
            return res.status(404).send('An error occurred while fetching the feed');
        }

        let { page, pageSize } = req.query;

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
                }
            },
            {
                $addFields: {
                    likeScore: {
                        $multiply: [
                            { $divide: ["$likes", "$avgLikes"] }, // Placeholder, will replace with actual value after
                            LIKE_WEIGHT
                        ]
                    },
                    lengthScore: {
                        $multiply: [
                            { $divide: [{ $strLenCP: "$body" }, "$avgBodyLength"] }, // Placeholder, will replace with actual value after
                            LENGTH_WEIGHT
                        ]
                    },
                    countryPriority: {
                        $cond: [{ $eq: ["$author.country", userCountry] }, 1000, 0]
                    }
                }
            },
            {
                $addFields: {
                    finalScore: { $add: ["$likeScore", "$lengthScore", "$countryPriority"] }
                }
            },
            { $sort: { finalScore: -1 } },
            { $skip: skip },
            { $limit: pageSizeNum },
            {
                $project: {
                    title: 1,
                    summary: 1,
                    author: 1,
                    createdAt: 1
                }
            }
        ];

        // Execute the aggregation pipeline
        const posts = await Post.aggregate(pipeline).exec();

        // Count total documents for pagination
        const total = await Post.countDocuments({
            community: { $in: user.communities },
            status: Status.Approved,
        }).exec();

        res.status(200).json({ posts, total, page: pageNum, pageSize: pageSizeNum });
    } catch (error: any) {
        console.error(error);
        res.status(500).send('An error occurred while fetching the feed');
    }
};