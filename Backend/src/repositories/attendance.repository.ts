import { db } from '../config/database.js';
import type { Attendance, CreateAttendanceDto, UpdateAttendanceDto } from '../interfaces/attendance.interfaces.ts';

export class AttendanceRepository {

  async findAll(): Promise<Attendance[]> {
    const query = `
      SELECT 
        id, 
        student_id, 
        course_id, 
        status,
        DATE_FORMAT(date, '%Y-%m-%d') as attendance_date,
        DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%sZ') as updated_at
      FROM attendances 
      ORDER BY id DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  async findByStudentId(studentId: number): Promise<Attendance[]> {
    const query = `
      SELECT id, student_id, course_id, status,
             DATE_FORMAT(date, '%Y-%m-%d') as attendance_date,
             DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') as created_at,
             DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%sZ') as updated_at
      FROM attendances 
      WHERE student_id = ?
      ORDER BY date DESC
    `;
    const result = await db.query(query, [studentId]);
    return result.rows;
  }

  async findByCourseId(courseId: number): Promise<Attendance[]> {
    const query = `
      SELECT id, student_id, course_id, status,
             DATE_FORMAT(date, '%Y-%m-%d') as attendance_date,
             DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') as created_at,
             DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%sZ') as updated_at
      FROM attendances 
      WHERE course_id = ?
      ORDER BY date DESC
    `;
    const result = await db.query(query, [courseId]);
    return result.rows;
  }

  async findByDate(date: string): Promise<Attendance[]> {
    const query = `
      SELECT id, student_id, course_id, status,
             DATE_FORMAT(date, '%Y-%m-%d') as attendance_date,
             DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') as created_at,
             DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%sZ') as updated_at
      FROM attendances 
      WHERE date = ?
      ORDER BY student_id
    `;
    const result = await db.query(query, [date]);
    return result.rows;
  }

  async create(data: CreateAttendanceDto): Promise<Attendance> {
    const query = `
      INSERT INTO attendances (student_id, course_id, date, status)
      VALUES (?, ?, ?, ?)
    `;
    const result = await db.query(query, [
      data.student_id,
      data.course_id,
      data.date,
      data.status || 'present'
    ]);
    return (await this.findById(result.insertId))!;
  }

  async update(id: number, data: UpdateAttendanceDto): Promise<Attendance | null> {
    const query = `
      UPDATE attendances 
      SET status = COALESCE(?, status),
          student_id = COALESCE(?, student_id),
          course_id = COALESCE(?, course_id),
          date = COALESCE(?, date),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    await db.query(query, [data.status, data.student_id, data.course_id, data.date, id]);
    return this.findById(id);
  }

  async findById(id: number): Promise<Attendance | null> {
    const query = `
      SELECT id, student_id, course_id, status,
             DATE_FORMAT(date, '%Y-%m-%d') as attendance_date,
             DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') as created_at,
             DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%sZ') as updated_at
      FROM attendances WHERE id = ?
    `;
    const result = await db.query<Attendance>(query, [id]);
    return result.rows[0] || null;
  }

async createTableIfNotExists() {
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS attendances (
          id INT AUTO_INCREMENT PRIMARY KEY,
          student_id INT NOT NULL,
          course_id INT NOT NULL,
          date DATE NOT NULL,
          status VARCHAR(20) DEFAULT 'present',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_attendance_student 
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
          CONSTRAINT fk_attendance_course 
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
          CONSTRAINT unique_student_course_date 
            UNIQUE (student_id, course_id, date)
        );
      `);

    } catch (error) {
      console.error('❌ Error creating attendances table:', error);
    }
  }
}
