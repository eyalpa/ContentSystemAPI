import { Request, Response } from 'express';
import { Post } from '../../models/postModel';
import { User } from '../../models/userModel';
import { generateSummary ,calculateRelevanceScore } from '../../utils/relevanceCalculator';

export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, body, author, community } = req.body;
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
            status: 'Pending approval'
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
        { $set: { status: 'Approved' } },
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
        
        if (!user ||  user.role !== 'super moderator') {
            console.error('User not found or Role is not super moderator');
            return res.status(404).send('An error occurred while fetching the feed');
        }

        const posts = await Post.find({
            community: { $in: user.communities },
            status: 'Approved'
        }).sort({ 'createdAt': -1 });

        const mappedPosts = posts.map(post => ({
            title: post.title,
            summary: post.summary,
            author: post.author,
            createdAt: post.createdAt,
            rank: calculateRelevanceScore(post , req.user?.country)
        })).sort((a, b) => b.rank - a.rank);

        res.status(200).json(mappedPosts);
    } catch (error: any) {
        console.error(error);
        res.status(500).send('An error occurred while fetching the feed');
    }
};
