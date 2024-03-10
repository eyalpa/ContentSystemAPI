import express from "express";
import {
  approvePost,
  createPost,
  getFeed,
} from "../controllers/postController";
import { validatePostCreation } from "../controllers/postController";
import { PostController } from "../controllers/postController";

const router = express.Router();
PostController;
router.post("/", validatePostCreation, createPost);
router.put("/approve/:postId", approvePost);
router.get("/feed", getFeed);

export default router;
