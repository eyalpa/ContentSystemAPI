import { User, IUser } from '../../models/userModel';

export const createUser = async (userData: IUser) => {
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
};

export const getUserById = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

// Additional methods like updateUser, deleteUser, etc., can be added here.
