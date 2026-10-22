import { StudentService } from '../services/students.services.js';
export class StudentController {
  private studentService: StudentService;

  constructor() {
    this.studentService = new StudentService();
  }

  async getAll(req: any, res: any) {
    try {
      const students = await this.studentService.getAllStudents();
      res.status(200).json({ success: true, count: students.length, data: students });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error fetching students', error: error.message });
    }
  }

  async getById(req: any, res: any) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

      const student = await this.studentService.getStudentById(id);
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

      res.status(200).json({ success: true, data: student });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error fetching student', error: error.message });
    }
  }

  async create(req: any, res: any) {
    try {
      const student = await this.studentService.createStudent(req.body);
      res.status(201).json({ success: true, message: 'Student created', data: student });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error creating student', error: error.message });
    }
  }

  async update(req: any, res: any) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

      const student = await this.studentService.updateStudent(id, req.body);
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

      res.status(200).json({ success: true, message: 'Student updated', data: student });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error updating student', error: error.message });
    }
  }

  async delete(req: any, res: any) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

      const deleted = await this.studentService.deleteStudent(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Student not found' });

      res.status(200).json({ success: true, message: 'Student deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error deleting student', error: error.message });
    }
  }

  async search(req: any, res: any) {
    try {
      const name = req.query.name as string;
      if (!name) return res.status(400).json({ success: false, message: 'Name query parameter is required' });

      const students = await this.studentService.searchStudents(name);
      res.status(200).json({ success: true, count: students.length, data: students });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error searching students', error: error.message });
    }
  }

  async getByDepartment(req: any, res: any) {
    try {
      const deptId = parseInt(req.params.deptId);
      if (isNaN(deptId)) return res.status(400).json({ success: false, message: 'Invalid department ID' });

      const students = await this.studentService.getStudentsByDepartment(deptId);
      res.status(200).json({ success: true, count: students.length, data: students });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error fetching students by department', error: error.message });
    }
  }
}