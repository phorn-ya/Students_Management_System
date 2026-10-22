import type { Attendance } from '../interfaces/attendance.interfaces.js';

export class AttendanceModel implements Attendance {
  id: number;
  student_id: number;
  course_id: number;
  attendance_date: string;
  status: 'present' | 'absent' | 'late';
  created_at?: string;
  updated_at?: string;

  constructor(data: Attendance) {
    this.id = data.id;
    this.student_id = data.student_id;
    this.course_id = data.course_id;
    this.attendance_date = data.attendance_date;
    this.status = data.status || 'present';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}