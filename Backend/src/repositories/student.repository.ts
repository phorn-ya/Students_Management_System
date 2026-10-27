import { db } from '../config/database.js';
import type { Student, CreateStudentDto, UpdateStudentDto } from '../interfaces/student.interfaces.js';

export class StudentRepository {

  async findAll(): Promise<Student[]> {
    const query = `
      SELECT id, user_id, first_name, last_name, department_id, class_id,
             DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') as created_at,
             DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%sZ') as updated_at
      FROM students 
      ORDER BY id DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  async findById(id: number): Promise<Student | null> {
    const query = `
      SELECT id, user_id, first_name, last_name, department_id, class_id,
             DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') as created_at,
             DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%sZ') as updated_at
      FROM students WHERE id = ?
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  async create(data: CreateStudentDto): Promise<Student> {
    const query = `
      INSERT INTO students (user_id, first_name, last_name, department_id, class_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await db.query(query, [
      data.user_id,
      data.first_name,
      data.last_name,
      data.department_id || null,
      data.class_id || null,
    ]);
    return (await this.findById(result.insertId))!;
  }

  async update(id: number, data: UpdateStudentDto): Promise<Student | null> {
    const query = `
      UPDATE students 
      SET first_name = COALESCE(?, first_name),
          last_name = COALESCE(?, last_name),
          department_id = COALESCE(?, department_id),
          class_id = IF(?, ?, class_id),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    await db.query(query, [
      data.first_name,
      data.last_name,
      data.department_id,
      data.class_id !== undefined,
      data.class_id ?? null,
      id
    ]);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await db.query('DELETE FROM students WHERE id = ?', [id]);
    return result.rowCount > 0;
  }

  async searchByName(name: string): Promise<Student[]> {
    const query = `
      SELECT id, user_id, first_name, last_name, department_id, class_id,
             DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') as created_at,
             DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%sZ') as updated_at
      FROM students 
      WHERE first_name LIKE ? OR last_name LIKE ?
      ORDER BY id DESC
    `;
    const result = await db.query(query, [`%${name}%`, `%${name}%`]);
    return result.rows;
  }

  async findByDepartment(departmentId: number): Promise<Student[]> {
    const query = `
      SELECT id, user_id, first_name, last_name, department_id, class_id,
             DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ') as created_at,
             DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%sZ') as updated_at
      FROM students 
      WHERE department_id = ?
      ORDER BY id DESC
    `;
    const result = await db.query(query, [departmentId]);
    return result.rows;
  }

  async createTableIfNotExists() {
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS students (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT UNIQUE NOT NULL,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          department_id INT,
          class_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          CONSTRAINT fk_student_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
          CONSTRAINT fk_student_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
        );
      `);

    } catch (error) {
      console.error('❌ Table init error:', error);
    }
  }
}
