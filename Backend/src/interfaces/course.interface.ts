export interface Course {
  id: number;
  name: string;
  code: string;
  description: string | null;
  credits: number;
  department_id: number | null;
  teacher_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCourseDto {
  name: string;
  code: string;
  description?: string | null;
  credits?: number;
  department_id?: number | null;
  teacher_id?: number | null;
}

export interface UpdateCourseDto {
  name?: string;
  code?: string;
  description?: string | null;
  credits?: number;
  department_id?: number | null;
  teacher_id?: number | null;
}
