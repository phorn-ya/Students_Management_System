import { db } from '../config/database.js';
import type { Teacher, CreateTeacherDto, UpdateTeacherDto } from '../interfaces/teacher.interface.js';

export class TeacherRepository {

  async findAll(): Promise<Teacher[]> {
    const query = `
      SELECT * 
      FROM teachers 
      ORDER BY id DESC
    `;
    const result = await db.query<Teacher>(query);
    return result.rows;
  }

  async findById(id: number): Promise<Teacher | null> {
    const query = `
      SELECT id, user_id, first_name, last_name, department_id,
             created_at, updated_at
      FROM teachers WHERE id = ?
    `;
    const result = await db.query<Teacher>(query, [id]);
    return result.rows[0] || null;
  }

  async findByDepartment(departmentId: number): Promise<Teacher[]> {
    const query = `
      SELECT id, user_id, first_name, last_name, department_id,
             created_at, updated_at
      FROM teachers 
      WHERE department_id = ?
      ORDER BY id DESC
    `;
    const result = await db.query<Teacher>(query, [departmentId]);
    return result.rows;
  }

  async create(data: CreateTeacherDto): Promise<Teacher> {
    const query = `
      INSERT INTO teachers (user_id, first_name, last_name, department_id)
      VALUES (?, ?, ?, ?)
    `;
    const result = await db.query(query, [
      data.user_id, data.first_name, data.last_name, data.department_id || null
    ]);
    return (await this.findById(result.insertId))!;
  }

  async update(id: number, data: UpdateTeacherDto): Promise<Teacher | null> {
    const updates: string[] = [];
    const params: any[] = [];

    if (data.first_name !== undefined) {
      params.push(data.first_name);
      updates.push('first_name = ?');
    }
    if (data.last_name !== undefined) {
      params.push(data.last_name);
      updates.push('last_name = ?');
    }
    if (data.department_id !== undefined) {
      params.push(data.department_id);
      updates.push('department_id = ?');
    }

    if (updates.length === 0) return this.findById(id);

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `UPDATE teachers SET ${updates.join(', ')} WHERE id = ?`;
    await db.query(query, params);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await db.query('DELETE FROM teachers WHERE id = ?', [id]);
    return result.rowCount > 0;
  }

  async createTableIfNotExists(): Promise<void> {
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS teachers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT UNIQUE NOT NULL,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          department_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_teacher_user
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          CONSTRAINT fk_teacher_department
            FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
        );
      `);

    } catch (error) {
      console.error('❌ Error creating teachers table:', error);
    }
  }
}
