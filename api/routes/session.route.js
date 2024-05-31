import express from 'express';
import { addSession, test, getSessions, addAttendance, getAttendance} from '../controllers/session.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/test', test);
router.post('/addSession', addSession);
router.get('/getSessions', getSessions);
router.post('/addAttendance/:sessionTitle', addAttendance);
router.get('/getAttendance/:sessionId', getAttendance);


export default router;