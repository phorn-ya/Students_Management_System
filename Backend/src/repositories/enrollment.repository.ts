import { db } from '../config/database.js';
import { EnrollmentModel } from '../models/enrollment.medel.js';
import type { CreateEnrollmentDto } from '../interfaces/enrollment.interface.js';

export class EnrollmentRepository {

  async findAll() {
    const query = `
      SELECT 
        id, 
        student_id, 
        course_id, 
        DATE_FORMAT(enrollment_date, '%Y-%m-%dT%H:%i:%sZ') as enrollment_date
      FROM enrollments 
      ORDER BY id DESC
    `;
    const result = await db.query(query);
    return result.rows.map(row => new EnrollmentModel(row));
  }

  async findByStudentId(studentId: number) {
    const query = `
      SELECT 
        id, 
        student_id, 
        course_id, 
        DATE_FORMAT(enrollment_date, '%Y-%m-%dT%H:%i:%sZ') as enrollment_date
      FROM enrollments 
      WHERE student_id = ?
      ORDER BY id DESC
    `;
    const result = await db.query(query, [studentId]);
    return result.rows.map(row => new EnrollmentModel(row));
  }

  async findByCourseId(courseId: number) {
    const query = `
      SELECT 
        id, 
        student_id, 
        course_id, 
        DATE_FORMAT(enrollment_date, '%Y-%m-%dT%H:%i:%sZ') as enrollment_date
      FROM enrollments 
      WHERE course_id = ?
      ORDER BY id DESC
    `;
    const result = await db.query(query, [courseId]);
    return result.rows.map(row => new EnrollmentModel(row));
  }

  async create(data: CreateEnrollmentDto) {
    const query = `
      INSERT INTO enrollments (student_id, course_id)
      VALUES (?, ?)
    `;
    const result = await db.query(query, [data.student_id, data.course_id]);
    const inserted = await db.query(
      `SELECT id, student_id, course_id,
              DATE_FORMAT(enrollment_date, '%Y-%m-%dT%H:%i:%sZ') as enrollment_date
       FROM enrollments WHERE id = ?`,
      [result.insertId],
    );
    return new EnrollmentModel(inserted.rows[0]);
  }

  async delete(id: number): Promise<boolean> {
    const result = await db.query('DELETE FROM enrollments WHERE id = ?', [id]);
    return result.rowCount > 0;
  }
}