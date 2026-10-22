import { Router } from 'express';
import { EnrollmentController } from '../controllers/enrollment.controller.js';

const router = Router();
const enrollmentController = new EnrollmentController();

router.get('/', enrollmentController.getAll.bind(enrollmentController));
router.get('/student/:studentId', enrollmentController.getByStudent.bind(enrollmentController));
router.get('/course/:courseId', enrollmentController.getByCourse.bind(enrollmentController));
router.post('/', enrollmentController.create.bind(enrollmentController));
router.delete('/:id', enrollmentController.delete.bind(enrollmentController));

export default router;