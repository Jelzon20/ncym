import express from 'express';
import { register, getRegistration, updateReg } from '../controllers/registration.controller.js';

import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/register', verifyToken, register);
router.get('/:regId', verifyToken, getRegistration);
router.put('/update/:regId/:userId/:isAdmin', verifyToken, updateReg);
// router.delete('/delete/:userId', verifyToken, deleteUser);
// router.post('/signout', signout);
// router.get('/getusers', verifyToken, getUsers);
// router.get('/:userId', getUser);

export default router;