import { db } from '../config/database.js';
import type { Course, CreateCourseDto, UpdateCourseDto } from '../interfaces/course.interface.js';

const courseSelect = `
  SELECT id, name, code, description, credits, department_id, teacher_id,
         DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') as created_at,
         DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%sZ') as updated_at
  FROM courses
`;

export class CourseRepository {
  async findAll(): Promise<Course[]> {
    const result = await db.query<Course>(`
      ${courseSelect}
      ORDER BY id DESC
    `);
    return result.rows;
  }

  async findById(id: number): Promise<Course | null> {
    const result = await db.query<Course>(`
      ${courseSelect}
      WHERE id = ?
    `, [id]);
    return result.rows[0] || null;
  }

  async findByTeacher(teacherId: number): Promise<Course[]> {
    const result = await db.query<Course>(`
      ${courseSelect}
      WHERE teacher_id = ?
      ORDER BY id DESC
    `, [teacherId]);
    return result.rows;
  }

  async create(data: CreateCourseDto): Promise<Course> {
    const result = await db.query<Course>(`
      INSERT INTO courses (name, code, description, credits, department_id, teacher_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      data.name,
      data.code,
      data.description || null,
      data.credits || 3,
      data.department_id || null,
      data.teacher_id || null,
    ]);
    return (await this.findById(result.insertId))!;
  }

  async update(id: number, data: UpdateCourseDto): Promise<Course | null> {
    const result = await db.query<Course>(`
      UPDATE courses
      SET name = COALESCE(?, name),
          code = COALESCE(?, code),
          description = COALESCE(?, description),
          credits = COALESCE(?, credits),
          department_id = COALESCE(?, department_id),
          teacher_id = COALESCE(?, teacher_id),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      data.name,
      data.code,
      data.description,
      data.credits,
      data.department_id,
      data.teacher_id,
      id,
    ]);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await db.query('DELETE FROM courses WHERE id = ?', [id]);
    return result.rowCount > 0;
  }

  async createTableIfNotExists(): Promise<void> {
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS courses (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          code VARCHAR(50) UNIQUE NOT NULL,
          description TEXT,
          credits INT DEFAULT 3,
          department_id INT,
          teacher_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_course_department
            FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
          CONSTRAINT fk_course_teacher
            FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
        );
      `);

    } catch (error) {
      console.error('❌ Error creating courses table:', error);
    }
  }
}
