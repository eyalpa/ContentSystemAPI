import express from 'express';
import { createUser, getUser , patchUserCommunity} from '../controllers/userController';

const router = express.Router();

router.post('/', createUser);
router.get('/:userId', getUser);

router.patch('/:communityId',patchUserCommunity);

export default router;
