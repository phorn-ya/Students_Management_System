import express from 'express';
import { CourseController } from '../controllers/CourseController.js';

const router = express.Router();
const courseController = new CourseController();

// GET /api/courses
router.get('/', courseController.getAll.bind(courseController));

// GET /api/courses/teacher/:teacherId
router.get('/teacher/:teacherId', courseController.getByTeacher.bind(courseController));

// GET /api/courses/:id
router.get('/:id', courseController.getById.bind(courseController));

// POST /api/courses
router.post('/', courseController.create.bind(courseController));

// PUT /api/courses/:id
router.put('/:id', courseController.update.bind(courseController));

// DELETE /api/courses/:id
router.delete('/:id', courseController.delete.bind(courseController));

export default router;
