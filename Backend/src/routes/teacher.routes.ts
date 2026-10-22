import express from 'express';
import { TeacherController } from '../controllers/TeacherController.js';
const router = express.Router();

const teacherController = new TeacherController();

// GET /api/teachers
router.get('/', teacherController.getAll.bind(teacherController));

// GET /api/teachers/department/:deptId
router.get('/department/:deptId', teacherController.getByDepartment.bind(teacherController));

// GET /api/teachers/:id
router.get('/:id', teacherController.getById.bind(teacherController));

// POST /api/teachers
router.post('/', teacherController.create.bind(teacherController));

// PUT /api/teachers/:id
router.put('/:id', teacherController.update.bind(teacherController));

export default router;
