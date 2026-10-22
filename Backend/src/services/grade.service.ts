import { db } from '../config/database.js'
import type { CreateGradeDto, UpdateGradeDto } from '../interfaces/grade.interface.js'

export class GradeService {
    async create(data:CreateGradeDto) {
        const query = ` INSERT INTO grades (student_id, course_id, score) VALUES (?, ?, ?);`;
        const values = [
            data.student_id, 
            data.course_id, 
            data.score];

        const result = await db.query(query, values);
        const inserted = await db.query('SELECT * FROM grades WHERE id = ?', [result.insertId]);
        return inserted.rows[0];
    }

    async findAll() {
        const result = await db.query(
            `SELECT * FROM grades;`
        );
        return result.rows
    }

    async findByStudent(studentId:number) {
        const result = await db.query(
            `SELECT * FROM grades WHERE student_id = ?;`,
            [studentId]
        );
        return result.rows
    }

    async findByCourse(courseId:number) {
        const result = await db.query(
            `SELECT * FROM grades WHERE course_id = ?;`,
            [courseId]
        );
        return result.rows
    }

    async findById(id: number) {
        const result = await db.query(
            `SELECT * FROM grades WHERE id = ?;`,
            [id]
        );
        return result.rows[0];
    }
    
    async update(id:number, data:UpdateGradeDto) {
        const query = ` UPDATE grades SET 
            student_id = COALESCE(?, student_id),
            course_id = COALESCE(?, course_id),
            score = COALESCE(?, score),
            updated_at = NOW()
            WHERE id = ?;`;
        const values = [
            data.student_id,
            data.course_id,
            data.score, id];

        await db.query(query, values)
        const updated = await db.query('SELECT * FROM grades WHERE id = ?', [id]);
        return updated.rows[0];
    }
    
    async delete(id:number) {
        await db.query(
            `DELETE FROM grades WHERE id = ?;`,
            [id]
        );
        return true;
    }
}