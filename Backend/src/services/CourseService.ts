import { CourseRepository } from '../repositories/course.repository.js';
import type { Course, CreateCourseDto, UpdateCourseDto } from '../interfaces/course.interface.js';

export class CourseService {
  private courseRepository = new CourseRepository();

  async getAll(): Promise<Course[]> {
    return this.courseRepository.findAll();
  }

  async getById(id: number): Promise<Course> {
    if (Number.isNaN(id)) throw new Error('Invalid course ID');
    const course = await this.courseRepository.findById(id);
    if (!course) throw new Error('Course not found');
    return course;
  }

  async getByTeacher(teacherId: number): Promise<Course[]> {
    if (Number.isNaN(teacherId)) throw new Error('Invalid teacher ID');
    return this.courseRepository.findByTeacher(teacherId);
  }

  async create(data: CreateCourseDto): Promise<Course> {
    if (!data.name || !data.code) {
      throw new Error('name and code are required');
    }
    return this.courseRepository.create({
      ...data,
      name: data.name.trim(),
      code: data.code.trim(),
    });
  }

  async update(id: number, data: UpdateCourseDto): Promise<Course> {
    await this.getById(id);
    const updated = await this.courseRepository.update(id, {
      ...data,
      name: data.name?.trim(),
      code: data.code?.trim(),
    });
    if (!updated) throw new Error('Failed to update course');
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.courseRepository.delete(id);
  }
}
