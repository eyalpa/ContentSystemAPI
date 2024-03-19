/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  communities: [],
  userCommunities: [],
  token: null,
  posts: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.userCommunities = action.payload.user.communities;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setcommunities: (state, action) => {
      if (state.userCommunities) {
        state.userCommunities = action.payload.communities;
      } else {
        console.error("user communities non-existent :(");
      }
    },
    setGlobalCommunities: (state, action) => {
      if (state.communities) {
        state.communities = action.payload.communities;
      } else {
        console.error("user communities non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPost = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPost;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
