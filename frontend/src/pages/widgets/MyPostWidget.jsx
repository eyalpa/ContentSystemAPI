/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import _ from "underscore";

import {
  Divider, InputBase, useTheme, Button, Select, MenuItem, InputLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import WidgetWrapper from "../../components/WidgetWrapper";
import { authActions } from "../../store/authSlice";
import FlexBetween from "../../components/FlexBetween";

function MyPostWidget() {
  const dispatch = useDispatch();

  const [post, setPost] = useState("");
  const [title, setTitle] = useState("");
  const allCommunities = useSelector((state) => state.communities);
  const userCommunities = useSelector((state) => state.userCommunities);
  const [communities, setCommunities] = useState([]);
  useEffect(() => {
    if (allCommunities) {
      const filteredCommunities = allCommunities.filter((x) => userCommunities.includes(x._id));
      if (!_.isEqual(communities, filteredCommunities)) {
        setCommunities(filteredCommunities);
      }
    }
  }, [allCommunities, communities, userCommunities]);

  const [selectedCommunity, setSelectedCommunity] = useState("");
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const handlePost = async () => {
    const response = await fetch("http://192.168.68.122:6001/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        body: post,
        title, // Assuming your endpoint expects a title; adjust as necessary
        community: selectedCommunity,
      }),
    });
    const posts = await response.json();
    dispatch(authActions.setPost({ posts }));
    setPost("");
    setSelectedCommunity("");
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="4.5rem" marginTop="5px">
        <InputBase
          placeholder="Post Title"
          onChange={(e) => setTitle(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      <FlexBetween gap="4.5rem" marginTop="5px">
        <InputBase
          placeholder="what's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      <FlexBetween fullWidth gap="4.5rem" marginTop="5px">
        <InputLabel id="community-select-label">Community</InputLabel>
        <Select
          labelId="community-select-label"
          id="community-select"
          value={selectedCommunity}
          label="Community"
          onChange={(e) => setSelectedCommunity(e.target.value)}
          sx={{ backgroundColor: palette.neutral.light, borderRadius: "1rem", width: "30rem" }}
        >
          {communities.map((community) => (
            <MenuItem key={community._id} value={community._id}>{community.title}</MenuItem>
          ))}
        </Select>
      </FlexBetween>

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <Button
          disabled={!post || !selectedCommunity}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
}

export default MyPostWidget;
