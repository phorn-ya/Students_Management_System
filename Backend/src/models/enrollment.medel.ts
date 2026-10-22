import type { Enrollment } from '../interfaces/enrollment.interface.js';

export class EnrollmentModel implements Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  enrollment_date?: string;

  constructor(data: Enrollment) {
    this.id = data.id;
    this.student_id = data.student_id;
    this.course_id = data.course_id;
    this.enrollment_date = data.enrollment_date;
  }

  // Optional: Helper method to get full name or formatted data
  getFormattedDate(): string {
    if (!this.enrollment_date) return 'N/A';
    return new Date(this.enrollment_date).toISOString().split('T')[0];
  }
}