import type { Student } from '../interfaces/student.interfaces.js';

export class StudentModel implements Student {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  department_id: number | null;
  created_at?: string;
  updated_at?: string;

  constructor(data: Student) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.department_id = data.department_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
