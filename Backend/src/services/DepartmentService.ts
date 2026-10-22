import { db } from '../config/database.js';

import type {
  Department,
  createDepartmentDto,
  updateDepartmentDto,
} from '../interfaces/department.interface.js';

export class DepartmentService {

  // GET ALL
  async getAll(): Promise<Department[]> {
    const result = await db.query(
      `
      SELECT *
      FROM departments
      ORDER BY id ASC
      `
    );

    return result.rows;
  }

  // GET BY ID
  async getById(id: number): Promise<Department> {

    const result = await db.query(
      `
      SELECT *
      FROM departments
      WHERE id = ?
      `,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Department not found');
    }

    return result.rows[0];
  }

  // CREATE
  async create(
    data: createDepartmentDto
  ): Promise<Department> {

    const { name, description } = data;

    if (!name) {
      throw new Error('Department name is required');
    }

    const existing = await db.query(
      `
      SELECT id
      FROM departments
      WHERE name = ?
      `,
      [name.trim()]
    );

    if (existing.rows.length > 0) {
      throw new Error('Department already exists');
    }

    const result = await db.query(
      `
      INSERT INTO departments (
        name,
        description
      )
      VALUES (?, ?)
      `,
      [
        name.trim(),
        description || null,
      ]
    );

    const created = await db.query(
      'SELECT * FROM departments WHERE id = ?',
      [result.insertId],
    );
    return created.rows[0];
  }

  // UPDATE
  async update(
    id: number,
    data: updateDepartmentDto
  ): Promise<Department> {

    const department = await this.getById(id);

    const updatedName =
      data.name || department.name;

    const updatedDescription =
      data.description || department.description;

    const result = await db.query(
      `
      UPDATE departments
      SET
        name = ?,
        description = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        updatedName,
        updatedDescription,
        id,
      ]
    );

    const updated = await db.query(
      'SELECT * FROM departments WHERE id = ?',
      [id],
    );
    return updated.rows[0];
  }

  // DELETE
  async delete(id: number): Promise<void> {

    await this.getById(id);

    await db.query(
      `
      DELETE FROM departments
      WHERE id = ?
      `,
      [id]
    );
  }
}