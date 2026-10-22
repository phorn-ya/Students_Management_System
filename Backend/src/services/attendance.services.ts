
import { AttendanceRepository } from '../repositories/attendance.repository.js';
import type { Attendance, CreateAttendanceDto, UpdateAttendanceDto } from '../interfaces/attendance.interfaces.ts';

export class AttendanceService {
  private repository: AttendanceRepository;

  constructor() {
    this.repository = new AttendanceRepository();
  }

  async getAllAttendances() { return this.repository.findAll(); }
  async getByStudent(studentId: number) { return this.repository.findByStudentId(studentId); }
  async getByCourse(courseId: number) { return this.repository.findByCourseId(courseId); }
  async getByDate(date: string) { return this.repository.findByDate(date); }
  async createAttendance(data: CreateAttendanceDto) { return this.repository.create(data); }
  async updateAttendance(id: number, data: UpdateAttendanceDto) { return this.repository.update(id, data); }
}