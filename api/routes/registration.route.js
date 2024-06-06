import express from 'express';
import { register, getRegistration, updateReg, getRegs, getMyReg, getRegistrationByVolunteer} from '../controllers/registration.controller.js';

import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/getregs', verifyToken, getRegs);
router.post('/register', verifyToken, register);
router.get('/me', verifyToken, getMyReg);
router.get('/:regId', verifyToken, getRegistration); 
router.put('/update/:regId/:userId/:isAdmin', verifyToken, updateReg);
router.get('/getRegByVol/:userId', verifyToken, getRegistrationByVolunteer);


export default router;