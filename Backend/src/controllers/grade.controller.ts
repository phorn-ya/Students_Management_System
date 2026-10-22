import type { Request, Response } from "express";
import { GradeService } from "../services/grade.service.js";

const gradeService = new GradeService();
export class GradeController {
    // POST /api/grades

    async create(req: Request, res: Response): Promise<void> {
        try{
            const grade = await gradeService.create(req.body);
            res.status(201).json({
                    success: true, message: 'Grade created successfully', 
                    data: grade
                });
        } 
        catch(error:any) {
            res.status(500).json({
                success: false, 
                message: 'Error creating grade', 
                error: error.message
            });
        }
    } 
    
     // GET /api/grades
    async getAll(req:Request, res:Response): Promise<void> {
        try {
            const grades = await gradeService.findAll();
            res.status(200).json({
                success: true,
                data: grades,
            });
        }
        catch(error: any){
            res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }
    
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid grade ID'
                })
            }
            const grade = await gradeService.findById(id);
            if (!grade) {
                res.status(404).json({
                    success: false,
                    message: 'Grade not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: grade,
            })
        }
        catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // GET /api/grades/student/:studentId
    async getByStudent(req: Request, res:Response): Promise<void> {
        try {
            const studentId = Number(req.params.studentId);
            if (isNaN(studentId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid student ID'
                });
                return;
            }
            const grades = await gradeService.findByStudent(studentId);

            res.status(200).json({
                success: true,
                data: grades
            });
        } 
        catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message

            });
        }
    }

      // GET /api/grades/course/:courseId
    async getByCours(req: Request, res: Response): Promise<void> {
        try {
            const courseId = Number(req.params.courseId);
            if (isNaN(courseId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid course ID'
                });
                return;
            }

            const grades = await gradeService.findByCourse(courseId);
            res.status(200).json({
                success: true,
                data: grades,
            })
        } 
        catch(error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

     // PUT /api/grades/:id
    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid grade ID'
                });
                return;
            }
            const grade = await gradeService.update(id, req.body);
            if (!grade) {
                res.status(404).json({
                    success: false,
                    message: 'Grade not found'
                })
            }
            res.status(200).json({
                success: true,
                message: 'Grade updated successfully',
            });
        } 
        catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }
     // DELETE /api/grades/:id
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid grade ID'
                });
                return;
            }
            const deleted = await gradeService.delete(id);
            if (!deleted) {
                res.status(404).json({
                    success: false,
                    message: 'Grade not found'
                })
            }
            res.status(200).json({
                success: true,
                message: 'Grade deleted successfully'
            });
        } 
        catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    
    }

}