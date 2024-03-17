/* eslint-disable react/prop-types */
import React from "react";
import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => (
  <Box width={size} height={size}>
    <img
      style={{ objectFit: "cover", borderRadius: "50%" }}
      width={size}
      height={size}
      alt="user"
      src={`http://192.168.68.122:6001/api/users/assets/${image}`}
    />
  </Box>
);

export default UserImage;
