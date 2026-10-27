import express from 'express';
import authRoutes from './routes/authRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js'
import studentRoutes from './routes/student.routes.js';
import enrollmentRoutes from './routes/enrollment.route.js';
import gradeRoutes from './routes/grade.routes.js';
import courseRoutes from './routes/courseRoutes.js';
import type { Request, Response } from 'express';
import logger from './utils/logger.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import attendanceRoutes from './routes/attendance.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import classRoutes from './routes/class.routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/attendances', attendanceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/grades', gradeRoutes)
app.use('/api/teachers', teacherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/classes', classRoutes);
app.use((req: Request, res: Response) => {
  logger.warn(`404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: 'Users not found',
    path: req.path,
  });
});


app.use(errorMiddleware);

export default app;
