import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller.js';

const router = Router();
const controller = new AttendanceController();

router.get('/', controller.getAll.bind(controller));
router.get('/student/:studentId', controller.getByStudent.bind(controller));
router.get('/course/:courseId', controller.getByCourse.bind(controller));
router.get('/date', controller.getByDate.bind(controller));

router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));

export default router;