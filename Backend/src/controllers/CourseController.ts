import type { Request, Response } from 'express';
import { CourseService } from '../services/CourseService.js';

export class CourseController {
  private courseService = new CourseService();

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const courses = await this.courseService.getAll();
      res.status(200).json({ success: true, data: courses });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error?.message ?? 'Internal server error' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const course = await this.courseService.getById(id);
      res.status(200).json({ success: true, data: course });
    } catch (error: any) {
      res.status(Number(error?.statusCode) || 404).json({ success: false, message: error?.message ?? 'Course not found' });
    }
  }

  async getByTeacher(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = Number(req.params.teacherId);
      const courses = await this.courseService.getByTeacher(teacherId);
      res.status(200).json({ success: true, data: courses });
    } catch (error: any) {
      res.status(Number(error?.statusCode) || 400).json({ success: false, message: error?.message ?? 'Bad request' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const course = await this.courseService.create(req.body);
      res.status(201).json({ success: true, message: 'Course created successfully', data: course });
    } catch (error: any) {
      res.status(Number(error?.statusCode) || 400).json({ success: false, message: error?.message ?? 'Bad request' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const course = await this.courseService.update(id, req.body);
      res.status(200).json({ success: true, message: 'Course updated successfully', data: course });
    } catch (error: any) {
      res.status(Number(error?.statusCode) || 400).json({ success: false, message: error?.message ?? 'Bad request' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this.courseService.delete(id);
      res.status(200).json({ success: true, message: 'Course deleted successfully' });
    } catch (error: any) {
      res.status(Number(error?.statusCode) || 400).json({ success: false, message: error?.message ?? 'Bad request' });
    }
  }
}
