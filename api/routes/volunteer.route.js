import express from 'express';
import { test, addVolunteer, volunteerSignin, volunteerSignout} from '../controllers/volunteer.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.post('/addVolunteer/', addVolunteer);
router.post('/volunteerSignIn', volunteerSignin);
router.post('/volunteerSignOut', volunteerSignout);
// router.get('/getusers', verifyToken, getUsers);
// router.get('/:userId', getUser);
// router.put('/enroll/:userId', enrollUser);
// router.post('/sendEmail/:email', sendEmail);

export default router;