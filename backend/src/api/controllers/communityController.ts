import { Request, Response } from 'express';
import { Community } from '../../models/communityModel'; // Adjust the path as necessary

export class CommunityController {
    // Get all communities
    async getAllCommunities(req: Request, res: Response) {
        try {
            const communities = await Community.find();
            res.json(communities);
        } catch (error:any) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a single community by ID
    async getCommunity(req: Request, res: Response) {
        try {
            const community = await Community.findById(req.params.id);
            if (!community) {
                return res.status(404).json({ message: 'Community not found' });
            }
            res.json(community);
        } catch (error:any) {
            res.status(500).json({ message: error.message });
        }
    }

    // Create a new community
    async createCommunity(req: Request, res: Response) {
        const community = new Community({
            title: req.body.title,
            image: req.body.image,
            memberCount: req.body.memberCount
        });

        try {
            const newCommunity = await community.save();
            res.status(201).json(newCommunity);
        } catch (error:any) {
            res.status(400).json({ message: error.message });
        }
    }

    // Additional methods for update (PUT) and delete (DELETE) can be added here
}
