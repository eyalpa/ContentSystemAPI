import express from 'express';
import { createUser, getUser ,getImage} from '../controllers/userController';

const router = express.Router();

router.post('/', createUser);
router.get('/:userId', getUser);
router.get('/assets/:name',getImage)

export default router;
