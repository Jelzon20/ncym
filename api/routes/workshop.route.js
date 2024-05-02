import express from 'express';
import { test, addWorkshop, getWorkshops, getWorkshop, getParticipants } from '../controllers/workshop.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/getWorkshop/:workshopId', verifyToken, getWorkshop);   
router.get('/test', test);

router.post('/addWorkshop', verifyToken, addWorkshop);
router.get('/getWorkshops', verifyToken, getWorkshops);
router.get('/getParticipants', verifyToken, getParticipants);
 

// router.put('/update/:userId', verifyToken, updateUser);
// router.delete('/delete/:userId', verifyToken, deleteUser);
// router.post('/signout', signout);
// router.get('/getusers', verifyToken, getUsers);
// router.get('/:userId', getUser);

export default router;