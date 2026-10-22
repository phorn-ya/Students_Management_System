export interface Grade {
    id: number;
    student_id: number;
    course_id: number;
    score: number;
    created_at?: string;
    updated_at?: string;

}

export interface CreateGradeDto {
    student_id: number;
    course_id: number;
    score: number;

}

export interface UpdateGradeDto {
    student_id?: number;
    course_id?: number;
    score?: number;

}