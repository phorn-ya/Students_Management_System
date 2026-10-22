
import { db } from '../config/database.js';
import { Department } from '../models/Department.js';

type DepartmentRow = {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export class DepartmentRepository {
  async getAll(): Promise<Department[]> {
    const result = await db.query<DepartmentRow>(
      'SELECT id, name, description, created_at AS createdAt, updated_at AS updatedAt FROM departments ORDER BY id ASC',
    );
    return result.rows.map((row) => new Department(row));
  }

  async getById(id: number): Promise<Department | null> {
    const result = await db.query<DepartmentRow>(
      'SELECT id, name, description, created_at AS createdAt, updated_at AS updatedAt FROM departments WHERE id = ?',
      [id],
    );

    const row = result.rows[0];
    return row ? new Department(row) : null;
  }

  async existsByName(name: string, excludeId?: number): Promise<boolean> {
    const normalized = name.trim();

    const result = await db.query<{ id: number }>(
      excludeId
        ? 'SELECT id FROM departments WHERE name = ? AND id <> ? LIMIT 1'
        : 'SELECT id FROM departments WHERE name = ? LIMIT 1',
      excludeId ? [normalized, excludeId] : [normalized],
    );

    return result.rows.length > 0;
  }

  async create(data: { name: string; description?: string | null }): Promise<Department> {
    const name = data.name.trim();
    const description = data.description?.trim() || null;

    const result = await db.query(
      'INSERT INTO departments (name, description) VALUES (?, ?)',
      [name, description],
    );

    const created = await this.getById(result.insertId);
    if (!created) throw new Error('Failed to create department');
    return created;
  }

  async update(
    id: number,
    data: { name: string; description?: string | null },
  ): Promise<Department> {
    const name = data.name.trim();
    const description = data.description?.trim() || null;

    await db.query(
      'UPDATE departments SET name = ?, description = ?, updated_at = NOW() WHERE id = ?',
      [name, description, id],
    );

    const updated = await this.getById(id);
    if (!updated) throw new Error('Failed to update department');
    return updated;
  }

  async delete(id: number): Promise<void> {
    await db.query('DELETE FROM departments WHERE id = ?', [id]);
  }
}
