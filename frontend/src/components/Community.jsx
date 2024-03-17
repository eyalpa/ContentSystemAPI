/* eslint-disable react/prop-types */
import React from "react";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import {
  Box, IconButton, Typography, useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { authActions } from "../store/authSlice";

function Community({
  CommunityId,
  title,
  memberCount,
  image,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const { communities } = useSelector((state) => state.user);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const { main } = palette.neutral;
  const { medium } = palette.neutral;

  const isCommunity = communities.find((community) => community._id === CommunityId);

  const patchCommunity = async () => {
    const response = await fetch(
      `http://192.168.68.122:6001/api/users/${_id}/${CommunityId}`,
      {
        method: "PATCH",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();
    dispatch(authActions.setcommunities({ communities: data }));
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={image} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${CommunityId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {title}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {memberCount}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton
        onClick={() => patchCommunity()}
        sx={{
          backgroundColor: primaryLight,
          p: "0.6rem",
        }}
      >
        {isCommunity ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
    </FlexBetween>
  );
}

export default Community;
