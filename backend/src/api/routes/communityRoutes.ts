import express from 'express';
import { CommunityController } from '../controllers/communityController'; // Adjust the path as necessary
import upload from '../middleware/multerMiddleware';

const router = express.Router();
const controller = new CommunityController();

router.get('/', controller.getAllCommunities);
router.get('/:id', controller.getCommunity);
router.post('/',upload.single('picture'), controller.createCommunity);

// Routes for PUT and DELETE can be added in a similar manner

export default router;
