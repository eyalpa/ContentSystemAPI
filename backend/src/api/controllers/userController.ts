import { Request, Response } from 'express';
import { User } from '../../models/userModel';


export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = new User(req.body);

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user);
    } catch (error: any ) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
export const patchUserCommunity = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id;
        const communityId = req.params.communityId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const isMember = user.communities.map(x => x.toString()).includes(communityId);
        if (isMember) {
            // Remove the user from the community
            user.communities = user.communities.filter(x => x.toString() !== communityId);
            await user.save();

        } else {
            await User.findByIdAndUpdate(
                userId,
                { $push: { communities: communityId } }
              );
            await user.save();

        }
          // Retrieve the updated user to reflect the changes
          const updatedUser = await User.findById(userId);
          res.send(updatedUser);
    } catch (error) {
        console.error('Patch User Community Error:', error);
        res.status(500).send('Internal server error');
    }
};


