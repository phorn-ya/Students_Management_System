export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  enrollment_date?: string;
  enrollment_date_formatted?: string;
}

export interface CreateEnrollmentDto {
  student_id: number;
  course_id: number;
}