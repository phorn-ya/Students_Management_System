export interface Attendance {
  id: number;
  student_id: number;
  course_id: number;
  attendance_date: string;
  status: 'present' | 'absent' | 'late';
  created_at?: string;
  updated_at?: string;
}

export interface CreateAttendanceDto {
  student_id: number;
  course_id: number;
  date: string; 
  status?: 'present' | 'absent' | 'late';
}

export interface UpdateAttendanceDto {
  status?: 'present' | 'absent' | 'late';
  student_id?: number;
  course_id?: number;
  date?: string;
}