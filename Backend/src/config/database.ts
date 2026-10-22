import mysql from 'mysql2/promise';
import type { ResultSetHeader } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  user: process.env.DB_USER || 'root',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ?? '',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

export interface DbQueryResult<T> {
  rows: T[];
  rowCount: number;
  insertId: number;
}

export const db = {
  query: async <T = any>(
    text: string,
    params?: readonly unknown[],
  ): Promise<DbQueryResult<T>> => {
    const [result] = await pool.query(text, params as any[]);

    if (Array.isArray(result)) {
      return {
        rows: result as unknown as T[],
        rowCount: result.length,
        insertId: 0,
      };
    }

    const header = result as ResultSetHeader;
    return {
      rows: [],
      rowCount: header.affectedRows,
      insertId: header.insertId,
    };
  },
};

export default pool;
