import express from "express";
import { PostController } from "../controllers/postController";

const router = express.Router();
const postController = new PostController();
router.get('/',postController.getFeed);
router.post(
  "/",
  postController.validatePostCreation,
  postController.createPost
);
router.put("/approve/:postId", postController.approvePost);
router.get("/feed", postController.getFeed);

export default router;
