/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Community from "../../components/Community";
import WidgetWrapper from "../../components/WidgetWrapper";
import { authActions } from "../../store/authSlice";

function CommunityListWidget() {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const { allcommunities } = useSelector((state) => state.user);

  const getcommunities = async () => {
    const response = await fetch(
      "http://192.168.68.122:6001/api/community/",
      {
        method: "GET",
        mode: "cors",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await response.json();
    dispatch(authActions.setGlobalCommunities({ communities: data }));
  };

  useEffect(() => {
    getcommunities();
  }, []);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Community List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {allcommunities.map((community) => (
          <Community
            key={community._id}
            CommunityId={community._id}
            title={`${community.title}`}
            memberCount={community.memberCount}
            image={community.image}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
}

export default CommunityListWidget;
