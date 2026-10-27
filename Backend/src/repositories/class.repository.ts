import { db } from "../config/database.js";
import type {
  CreateClassDto,
  SchoolClass,
  UpdateClassDto,
} from "../interfaces/class.interface.js";

export class ClassRepository {
  async findAll(): Promise<SchoolClass[]> {
    const result = await db.query<SchoolClass>(
      `SELECT id, name, description, created_at, updated_at
       FROM classes
       ORDER BY name`,
    );
    return result.rows;
  }

  async create(data: CreateClassDto): Promise<SchoolClass> {
    const result = await db.query(
      `INSERT INTO classes (name, description) VALUES (?, ?)`,
      [data.name, data.description ?? null],
    );
    const created = await db.query<SchoolClass>(
      `SELECT id, name, description, created_at, updated_at
       FROM classes WHERE id = ?`,
      [result.insertId],
    );
    return created.rows[0];
  }

  async update(id: number, data: UpdateClassDto): Promise<SchoolClass | null> {
    const current = await db.query<SchoolClass>(
      `SELECT id, name, description, created_at, updated_at
       FROM classes WHERE id = ?`,
      [id],
    );
    if (!current.rows[0]) return null;

    await db.query(
      `UPDATE classes
       SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        data.name ?? current.rows[0].name,
        data.description === undefined
          ? current.rows[0].description
          : data.description,
        id,
      ],
    );
    const updated = await db.query<SchoolClass>(
      `SELECT id, name, description, created_at, updated_at
       FROM classes WHERE id = ?`,
      [id],
    );
    return updated.rows[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await db.query(`DELETE FROM classes WHERE id = ?`, [id]);
    return result.rowCount > 0;
  }
}
