/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React from "react";
import {
  IconButton, Typography, useTheme,
} from "@mui/material";
import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
} from "@mui/icons-material";
import WidgetWrapper from "../../components/WidgetWrapper";

function PostWidget({
  community, // Assuming community details are passed
  body,
  title,
  summary,
  author, // Assuming author details are passed
  likes,
  createdAt,
}) {
  const [isLiked, setIsLiked] = React.useState(false); // Simplified like handling
  // eslint-disable-next-line no-unused-vars
  const { palette } = useTheme();

  const toggleLike = async () => {
    // Simplified like toggle logic
    setIsLiked(!isLiked);
    // Implement the like API call and dispatch here
  };

  return (
    <WidgetWrapper m="2rem 0">
      {/* Community and Author information rendering assumed. Adjust based on actual data structure. */}
      <Typography variant="h6">
        {author.name}
        {" "}
        -
        {" "}
        {community.title}
      </Typography>
      <Typography variant="h2">
        {" "}
        { title }
      </Typography>
      <Typography variant="h2">
        {" "}
        { summary }
      </Typography>
      <Typography variant="h2">
        {" "}
        { body }
      </Typography>
      <Typography color="textSecondary" sx={{ mb: "1rem" }}>{createdAt.toLocaleString()}</Typography>
      {/* Assume body content is passed as `description` */}
      {/* Rendering of the post's content, status, and interactions */}
      <IconButton onClick={toggleLike}>
        {isLiked ? <FavoriteOutlined color="secondary" /> : <FavoriteBorderOutlined />}
      </IconButton>
      <Typography>{likes}</Typography>
      {/* Additional interactions and content here */}
    </WidgetWrapper>
  );
}

export default PostWidget;
