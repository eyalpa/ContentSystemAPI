/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/authSlice";
import PostWidget from "./PostWidget";

function PostsWidget({ loggedInUserId, isProfile = false }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [intervalId, setIntervalId] = useState(null); // State to hold interval ID
  const posts = useSelector((state) => state.posts || []);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      let url = "http://localhost:6001/api/posts/";
      if (isProfile) {
        url += `user/${loggedInUserId}`;
      }

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posts.");
        }

        const data = await response.json();
        dispatch(authActions.setPosts({ posts: data.posts }));
      } catch (errorCatch) {
        setError(errorCatch.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch posts initially
    fetchPosts();

    // Set up interval to fetch posts periodically
    const id = setInterval(fetchPosts, 60000); // Fetch every minute (adjust as needed)
    setIntervalId(id);

    // Clean up interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, isProfile, loggedInUserId, token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error:
        {error}
      </div>
    );
  }

  if (!Array.isArray(posts) || posts.length === 0) {
    return <div>No posts found.</div>;
  }

  return (
    <>
      {posts.map((post) => (
        <PostWidget
          key={post._id}
          postId={post._id}
          body={post.body}
          title={post.title}
          community={post.communityDetails[0]}
          summary={post.summary}
          author={post.authorDetails[0]} // Assuming this needs to be converted or looked up
          likes={post.likes}
          createdAt={post.createdAt}
          // Assuming `comments` are part of your response or handled differently
        />
      ))}
    </>
  );
}

export default PostsWidget;
