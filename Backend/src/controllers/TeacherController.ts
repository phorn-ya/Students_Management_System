import type { Request, Response } from 'express';
import { TeacherService } from '../services/TeacherService.js';

export class TeacherController {
  private teacherService: TeacherService = new TeacherService();

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const teachers = await this.teacherService.getAll();
      res.status(200).json({
        success: true,
        data: teachers,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error?.message ?? 'Internal server error',
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const teacher = await this.teacherService.getById(id);
      res.status(200).json({
        success: true,
        data: teacher,
      });
    } catch (error: any) {
      res.status(Number(error?.statusCode) || 404).json({
        success: false,
        message: error?.message ?? 'Teacher not found',
      });
    }
  }

  async getByDepartment(req: Request, res: Response): Promise<void> {
    try {
      const departmentId = Number(req.params.deptId);
      const teachers = await this.teacherService.getByDepartment(departmentId);
      res.status(200).json({
        success: true,
        data: teachers,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error?.message ?? 'Internal server error',
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const teacher = await this.teacherService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Teacher created successfully',
        data: teacher,
      });
    } catch (error: any) {
      res.status(Number(error?.statusCode) || 400).json({
        success: false,
        message: error?.message ?? 'Bad request',
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const teacher = await this.teacherService.update(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Teacher updated successfully',
        data: teacher,
      });
    } catch (error: any) {
      res.status(Number(error?.statusCode) || 400).json({
        success: false,
        message: error?.message ?? 'Bad request',
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this.teacherService.delete(id);
      res.status(200).json({
        success: true,
        message: 'Teacher deleted successfully',
      });
    } catch (error: any) {
      res.status(Number(error?.statusCode) || 400).json({
        success: false,
        message: error?.message ?? 'Bad request',
      });
    }
  }
}
