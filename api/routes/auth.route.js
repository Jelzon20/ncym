import express from 'express';
import { signup, signin, google, checkAuth} from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/checkAuth', checkAuth);
router.post('/google', google);

export default router;