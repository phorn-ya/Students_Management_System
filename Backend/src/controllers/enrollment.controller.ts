import { EnrollmentService } from '../services/enrollment.services.js';
import type { CreateEnrollmentDto } from '../interfaces/enrollment.interface.js';

export class EnrollmentController {
  private enrollmentService: EnrollmentService;

  constructor() {
    this.enrollmentService = new EnrollmentService();
  }

  async getAll(req: any, res: any) {
    try {
      const enrollments = await this.enrollmentService.getAllEnrollments();
      res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error fetching enrollments', error: error.message });
    }
  }

  async getByStudent(req: any, res: any) {
    try {
      const studentId = parseInt(req.params.studentId);
      if (isNaN(studentId)) return res.status(400).json({ success: false, message: 'Invalid student ID' });

      const enrollments = await this.enrollmentService.getEnrollmentsByStudent(studentId);
      res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error fetching enrollments', error: error.message });
    }
  }

  async getByCourse(req: any, res: any) {
    try {
      const courseId = parseInt(req.params.courseId);
      if (isNaN(courseId)) return res.status(400).json({ success: false, message: 'Invalid course ID' });

      const enrollments = await this.enrollmentService.getEnrollmentsByCourse(courseId);
      res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error fetching enrollments', error: error.message });
    }
  }

  async create(req: any, res: any) {
    try {
      const data: CreateEnrollmentDto = req.body;
      const enrollment = await this.enrollmentService.createEnrollment(data);
      res.status(201).json({ success: true, message: 'Enrollment created successfully', data: enrollment });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error creating enrollment', error: error.message });
    }
  }

  async delete(req: any, res: any) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

      const deleted = await this.enrollmentService.deleteEnrollment(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Enrollment not found' });

      res.status(200).json({ success: true, message: 'Enrollment deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error deleting enrollment', error: error.message });
    }
  }
}