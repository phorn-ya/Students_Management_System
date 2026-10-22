export interface Student {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  department_id: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateStudentDto {
  user_id: number;
  first_name: string;
  last_name: string;
  department_id?: number | null;
}

export  interface UpdateStudentDto {
  first_name?: string;
  last_name?: string;
  department_id?: number | null;
}