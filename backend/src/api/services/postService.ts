import { Status } from '../../enums/posts/status';
import { Post } from '../../models/postModel';
import { IUser } from '../../models/userModel'; // Import the user interface

export const createPost = async (postData: any, user: IUser) => {
    if (!user.communities.includes(postData.community)) {
        throw new Error('User does not belong to the community');
    }

    const newPost = new Post({
        ...postData,
        author: user._id,
        status: Status.PendingApproval
    });

    await newPost.save();
    return newPost;
};

export const updatePostLikes = async (postId: string, likeChange: number) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }

    post.likes += likeChange;
    await post.save();
    return post;
};

// Additional methods like getPost, deletePost, etc., can
