import express from 'express';
import { approvePost, createPost, getFeed } from '../controllers/postController';

const router = express.Router();

router.post('/', createPost);
router.put('/approve/:postId', approvePost);
router.get('/feed', getFeed);

export default router;
