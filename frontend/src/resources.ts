import { BookOpen, CalendarDays, GraduationCap, Users, Building2, ClipboardCheck, FileText, UserRound, LayoutDashboard } from 'lucide-react';
import type { PageKey, Resource, Row } from './types';

export const resources: Resource[] = [
  {
    key: 'students', label: 'Students', singular: 'student', endpoint: '/students', icon: GraduationCap,
    columns: [
      { key: 'full_name', label: 'Student', render: row => `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim() },
      { key: 'user_id', label: 'User ID' },
      { key: 'department_id', label: 'Department', render: (row, app) => findName(app.departments, row.department_id, 'name') },
    ],
    createFields: [
      { key: 'username', label: 'Login username', required: true },
      { key: 'email', label: 'Email address', type: 'email', required: true },
      { key: 'password', label: 'Temporary password', type: 'password', required: true },
      { key: 'first_name', label: 'First name', required: true },
      { key: 'last_name', label: 'Last name', required: true },
      { key: 'department_id', label: 'Department', type: 'select', options: 'departments' },
    ],
    editFields: [
      { key: 'first_name', label: 'First name', required: true },
      { key: 'last_name', label: 'Last name', required: true },
      { key: 'department_id', label: 'Department', type: 'select', options: 'departments' },
    ],
    canDelete: true,
  },
  {
    key: 'teachers', label: 'Teachers', singular: 'teacher', endpoint: '/teachers', icon: UserRound,
    columns: [
      { key: 'full_name', label: 'Teacher', render: row => `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim() },
      { key: 'user_id', label: 'User ID' },
      { key: 'department_id', label: 'Department', render: (row, app) => findName(app.departments, row.department_id, 'name') },
    ],
    createFields: [
      { key: 'username', label: 'Login username', required: true },
      { key: 'email', label: 'Email address', type: 'email', required: true },
      { key: 'password', label: 'Temporary password', type: 'password', required: true },
      { key: 'first_name', label: 'First name', required: true },
      { key: 'last_name', label: 'Last name', required: true },
      { key: 'department_id', label: 'Department', type: 'select', options: 'departments' },
    ],
    editFields: [
      { key: 'first_name', label: 'First name', required: true },
      { key: 'last_name', label: 'Last name', required: true },
      { key: 'department_id', label: 'Department', type: 'select', options: 'departments' },
    ],
  },
  {
    key: 'courses', label: 'Courses', singular: 'course', endpoint: '/courses', icon: BookOpen,
    columns: [
      { key: 'name', label: 'Course name' },
      { key: 'code', label: 'Course code' },
      { key: 'credits', label: 'Credits' },
      { key: 'department_id', label: 'Department', render: (row, app) => findName(app.departments, row.department_id, 'name') },
      { key: 'teacher_id', label: 'Teacher', render: (row, app) => findPerson(app.teachers, row.teacher_id) },
    ],
    createFields: [
      { key: 'name', label: 'Course name', required: true },
      { key: 'code', label: 'Course code', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'credits', label: 'Credits', type: 'number', required: true },
      { key: 'department_id', label: 'Department', type: 'select', options: 'departments' },
      { key: 'teacher_id', label: 'Teacher', type: 'select', options: 'teachers' },
    ],
    editFields: [
      { key: 'name', label: 'Course name', required: true },
      { key: 'code', label: 'Course code', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'credits', label: 'Credits', type: 'number' },
      { key: 'department_id', label: 'Department', type: 'select', options: 'departments' },
      { key: 'teacher_id', label: 'Teacher', type: 'select', options: 'teachers' },
    ],
    canDelete: true,
  },
  {
    key: 'departments', label: 'Departments', singular: 'department', endpoint: '/departments', icon: Building2,
    columns: [{ key: 'name', label: 'Department name' }, { key: 'description', label: 'Description' }],
    createFields: [{ key: 'name', label: 'Department name', required: true }, { key: 'description', label: 'Description', type: 'textarea' }],
    editFields: [{ key: 'name', label: 'Department name', required: true }, { key: 'description', label: 'Description', type: 'textarea' }],
    canDelete: true,
  },
  {
    key: 'enrollments', label: 'Enrollments', singular: 'enrollment', endpoint: '/enrollments', icon: ClipboardCheck,
    columns: [
      { key: 'student_id', label: 'Student', render: (row, app) => findPerson(app.students, row.student_id) },
      { key: 'course_id', label: 'Course', render: (row, app) => findName(app.courses, row.course_id, 'name') },
      { key: 'enrollment_date', label: 'Enrolled on', render: row => formatDate(row.enrollment_date) },
    ],
    createFields: [
      { key: 'student_id', label: 'Student', type: 'select', options: 'students', required: true },
      { key: 'course_id', label: 'Course', type: 'select', options: 'courses', required: true },
    ],
    editFields: [],
    canDelete: true,
  },
  {
    key: 'grades', label: 'Grades', singular: 'grade', endpoint: '/grades', icon: FileText,
    columns: [
      { key: 'student_id', label: 'Student', render: (row, app) => findPerson(app.students, row.student_id) },
      { key: 'course_id', label: 'Course', render: (row, app) => findName(app.courses, row.course_id, 'name') },
      { key: 'score', label: 'Score', render: row => `${row.score ?? '—'} / 100` },
      { key: 'created_at', label: 'Recorded', render: row => formatDate(row.created_at) },
    ],
    createFields: [
      { key: 'student_id', label: 'Student', type: 'select', options: 'students', required: true },
      { key: 'course_id', label: 'Course', type: 'select', options: 'courses', required: true },
      { key: 'score', label: 'Score (0–100)', type: 'number', required: true },
    ],
    editFields: [
      { key: 'student_id', label: 'Student', type: 'select', options: 'students', required: true },
      { key: 'course_id', label: 'Course', type: 'select', options: 'courses', required: true },
      { key: 'score', label: 'Score (0–100)', type: 'number', required: true },
    ],
    canDelete: true,
  },
  {
    key: 'attendance', label: 'Attendance', singular: 'attendance record', endpoint: '/attendances', icon: CalendarDays,
    columns: [
      { key: 'student_id', label: 'Student', render: (row, app) => findPerson(app.students, row.student_id) },
      { key: 'course_id', label: 'Course', render: (row, app) => findName(app.courses, row.course_id, 'name') },
      { key: 'attendance_date', label: 'Date', render: row => formatDate(row.attendance_date) },
      { key: 'status', label: 'Status' },
    ],
    createFields: [
      { key: 'student_id', label: 'Student', type: 'select', options: 'students', required: true },
      { key: 'course_id', label: 'Course', type: 'select', options: 'courses', required: true },
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'status', label: 'Status', type: 'select', options: 'attendanceStatus', required: true },
    ],
    editFields: [
      { key: 'student_id', label: 'Student', type: 'select', options: 'students' },
      { key: 'course_id', label: 'Course', type: 'select', options: 'courses' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: 'attendanceStatus' },
    ],
  },
];

export const pageLabels: Record<PageKey, string> = {
  dashboard: 'Overview', students: 'Students', teachers: 'Teachers', courses: 'Courses',
  departments: 'Departments', enrollments: 'Enrollments', grades: 'Grades', attendance: 'Attendance',
};

export const navItems: { key: PageKey; group: string; icon: typeof Users }[] = [
  { key: 'dashboard', group: 'Workspace', icon: LayoutDashboard },
  { key: 'students', group: 'Academic', icon: GraduationCap },
  { key: 'teachers', group: 'Academic', icon: Users },
  { key: 'courses', group: 'Academic', icon: BookOpen },
  { key: 'departments', group: 'Academic', icon: Building2 },
  { key: 'enrollments', group: 'Management', icon: ClipboardCheck },
  { key: 'grades', group: 'Management', icon: FileText },
  { key: 'attendance', group: 'Management', icon: CalendarDays },
];

export function findName(rows: Row[] = [], id: number | string | null | undefined, field: string) {
  if (id == null || id === '') return '—';
  return rows.find(row => Number(row.id) === Number(id))?.[field] ?? `#${id}`;
}

export function findPerson(rows: Row[] = [], id: number | string | null | undefined) {
  const row = rows.find(item => Number(item.id) === Number(id));
  return row ? `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim() || `#${id}` : id ? `#${id}` : '—';
}

export function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date);
}
