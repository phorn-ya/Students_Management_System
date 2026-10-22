import { EnrollmentRepository } from '../repositories/enrollment.repository.js';
import type { CreateEnrollmentDto } from '../interfaces/enrollment.interface.js';
import { EnrollmentModel } from '../models/enrollment.medel.js';

export class EnrollmentService {
  private repository: EnrollmentRepository;

  constructor() {
    this.repository = new EnrollmentRepository();
  }

  async getAllEnrollments(): Promise<EnrollmentModel[]> {
    return this.repository.findAll();
  }

  async getEnrollmentsByStudent(studentId: number): Promise<EnrollmentModel[]> {
    return this.repository.findByStudentId(studentId);
  }

  async getEnrollmentsByCourse(courseId: number): Promise<EnrollmentModel[]> {
    return this.repository.findByCourseId(courseId);
  }

  async createEnrollment(data: CreateEnrollmentDto): Promise<EnrollmentModel> {
    return this.repository.create(data);
  }

  async deleteEnrollment(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}