import { LeanOrFull } from '../../dal/MongoDBConnector';
import { User, IUser } from '../../models/userModel';

export const createUser = async (userData: IUser) => {
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
};

export const getUserById = async <Lean extends boolean = true>(
    userId: string,
    lean: Lean = true as Lean
  ): Promise<LeanOrFull<IUser, Lean>> => {
    const query = User.findById(userId);
    const user = (lean ? await query.lean() : await query) as LeanOrFull<IUser, Lean>;
    
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  };
  

// Additional methods like updateUser, deleteUser, etc., can be added here.
