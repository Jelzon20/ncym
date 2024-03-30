import express from 'express';
import { register } from '../controllers/registration.controller.js';

import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/register', verifyToken, register);
// router.put('/update/:userId', verifyToken, updateUser);
// router.delete('/delete/:userId', verifyToken, deleteUser);
// router.post('/signout', signout);
// router.get('/getusers', verifyToken, getUsers);
// router.get('/:userId', getUser);

export default router;