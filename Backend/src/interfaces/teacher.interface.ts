export interface Teacher {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  department_id: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTeacherDto {
  user_id: number;
  first_name: string;
  last_name: string;
  department_id?: number | null;
}

export interface UpdateTeacherDto {
  first_name?: string;
  last_name?: string;
  department_id?: number | null;
}
