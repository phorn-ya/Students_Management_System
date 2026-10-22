import { TeacherRepository } from '../repositories/TeacherRepository.js';
import type { Teacher, CreateTeacherDto, UpdateTeacherDto } from '../interfaces/teacher.interface.js';

export class TeacherService {
  private teacherRepository: TeacherRepository;

  constructor() {
    this.teacherRepository = new TeacherRepository();
  }

  async getAll(): Promise<Teacher[]> {
    return this.teacherRepository.findAll();
  }

  async getById(id: number): Promise<Teacher> {
    const teacher = await this.teacherRepository.findById(id);
    if (!teacher) {
      throw new Error('Teacher not found');
    }
    return teacher;
  }

  async getByDepartment(departmentId: number): Promise<Teacher[]> {
    return this.teacherRepository.findByDepartment(departmentId);
  }

  async create(data: CreateTeacherDto): Promise<Teacher> {
    if (!data.user_id || !data.first_name || !data.last_name) {
      throw new Error('user_id, first_name, and last_name are required');
    }
    return this.teacherRepository.create(data);
  }

  async update(id: number, data: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.getById(id);
    const updated = await this.teacherRepository.update(id, data);
    if (!updated) {
      throw new Error('Failed to update teacher');
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.teacherRepository.delete(id);
  }
}
