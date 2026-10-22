import { StudentRepository } from '../repositories/student.repository.js';
import type { Student, CreateStudentDto, UpdateStudentDto } from '../interfaces/student.interfaces.js';

export class StudentService {
  private repository: StudentRepository;

  constructor() {
    this.repository = new StudentRepository();
  }

  async getAllStudents(): Promise<Student[]> { return this.repository.findAll(); }
  async getStudentById(id: number): Promise<Student | null> { return this.repository.findById(id); }
  async createStudent(data: CreateStudentDto): Promise<Student> { return this.repository.create(data); }
  async updateStudent(id: number, data: UpdateStudentDto): Promise<Student | null> { return this.repository.update(id, data); }
  async deleteStudent(id: number): Promise<boolean> { return this.repository.delete(id); }
  async searchStudents(name: string): Promise<Student[]> { return this.repository.searchByName(name); }
  async getStudentsByDepartment(departmentId: number): Promise<Student[]> { return this.repository.findByDepartment(departmentId); }
}