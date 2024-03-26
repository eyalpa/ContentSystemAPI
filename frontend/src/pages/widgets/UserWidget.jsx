/* eslint-disable react/prop-types */
import {
  ManageAccountsOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";
import {
  Box, Typography, Divider, useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserImage from "../../components/UserImage";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const { dark } = palette.neutral;
  const { medium } = palette.neutral;
  const { main } = palette.neutral;

  const getUser = async () => {
    const response = await fetch(
      `http://localhost:6001/api/users/${userId}`,
      {
        method: "GET",
        mode: "cors",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user) {
    return null;
  }

  const {
    name,
    country,
    viewedProfile,
    impressions,
    communities,
  } = user;

  return (
    <WidgetWrapper>
      {/* First row */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  curson: "pointer",
                },
              }}
            >
              {name}
            </Typography>
            <Typography color={medium}>
              {communities.length}
              {" "}
              communities
            </Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* Second Row */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{country}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* Third Row */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who&apos;s viewed your profile</Typography>
          <Typography color={medium} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={medium} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

    </WidgetWrapper>
  );
};

export default UserWidget;
