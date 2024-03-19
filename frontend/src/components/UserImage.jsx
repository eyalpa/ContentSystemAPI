import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from "prop-types";
import { Box } from "@mui/material";

const UserImage = ({ image = "https://fastly.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY", size = "60px" }) => (
  <Box width={size} height={size}>
    <img
      style={{ objectFit: "cover", borderRadius: "50%" }}
      width={size}
      height={size}
      alt="user"
      // Use a ternary operator to check if `image` starts with "http"
      src={image.startsWith("http") ? image : `http://192.168.68.122:6001/api/auth/assets/${image}`}
    />
  </Box>
);
UserImage.defaultProps = {
  size: "60px", // Define default size
};

// Define prop types for UserImage
UserImage.propTypes = {
  image: PropTypes.string.isRequired, // Define image as a required string
  size: PropTypes.string, // Define size as a string
};

export default UserImage;
