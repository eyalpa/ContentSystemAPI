import React, { useEffect, useState } from "react";
import {
  Box, Typography, useTheme, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Community from "../../components/Community";
import WidgetWrapper from "../../components/WidgetWrapper";
import { authActions } from "../../store/authSlice";

function CommunityListWidget() {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const communities = useSelector((state) => state.communities);
  const [open, setOpen] = useState(false); // State to manage dialog visibility
  const [newCommunity, setNewCommunity] = useState({ title: "", imageUrl: "", imageFile: null });

  const getcommunities = async () => {
    const response = await fetch("http://localhost:6001/api/community", {
      method: "GET",
      mode: "cors",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(authActions.setGlobalCommunities({ communities: data }));
  };

  useEffect(() => {
    getcommunities();
  }, [communities]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewCommunity({ title: "", imageUrl: "", imageFile: null }); // Reset form on close
  };

  const handleAddCommunity = async () => {
    if (!newCommunity.title || newCommunity.title.trim() === "") {
      // eslint-disable-next-line no-alert
      alert("Title is required."); // You can replace this with a more user-friendly message or UI element
      return;
    }

    const apiUrl = "http://localhost:6001/api/community/";

    // Use FormData to prepare the data for sending
    const formData = new FormData();
    formData.append("title", newCommunity.title);
    // Append image file if it exists
    if (newCommunity.imageFile) {
      formData.append("picture", newCommunity.imageFile, newCommunity.imageFile.name);
      formData.append("image", newCommunity.imageFile.name); // Adjust this as necessary based on your application's logic
    }
    formData.append("memberCount", 100); // Adjust this as necessary based on your application's logic

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData, // FormData will be sent with 'multipart/form-data' type automatically
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      // Handle success (e.g., closing the dialog, refreshing the list)
      console.log("Community added", data);
      handleClose();
    } catch (error) {
      // Handle error
      console.error("Error adding community:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setNewCommunity((prev) => ({ ...prev, imageFile: files[0] }));
    } else {
      setNewCommunity((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <WidgetWrapper>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          color={palette.neutral.dark}
          variant="h5"
          fontWeight="500"
          sx={{ mb: "1.5rem" }}
        >
          Community List
        </Typography>
        <Button variant="contained" onClick={handleClickOpen} sx={{ mb: "1.5rem" }}>+</Button>
      </Box>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {communities.map((community) => (
          <Community
            key={community._id}
            CommunityId={community._id}
            title={`${community.title}`}
            memberCount={community.memberCount}
            image={community.image}
          />
        ))}
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Community</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Community Name"
            type="text"
            fullWidth
            variant="standard"
            name="title"
            value={newCommunity.title}
            onChange={handleInputChange}
          />
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              name="imageFile"
              onChange={handleInputChange}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddCommunity}>Add</Button>
        </DialogActions>
      </Dialog>

    </WidgetWrapper>
  );
}

export default CommunityListWidget;
