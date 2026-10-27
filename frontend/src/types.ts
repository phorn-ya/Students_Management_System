import type { LucideIcon } from "lucide-react";

export type Row = Record<string, any>;
export type PageKey =
  | "dashboard"
  | "students"
  | "teachers"
  | "courses"
  | "departments"
  | "classes"
  | "enrollments"
  | "grades"
  | "attendance";
export type FormField = {
  key: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "select"
    | "textarea";
  required?: boolean;
  options?: string;
  placeholder?: string;
};
export type Resource = {
  key: Exclude<PageKey, "dashboard">;
  label: string;
  singular: string;
  endpoint: string;
  icon: LucideIcon;
  columns: {
    key: string;
    label: string;
    render?: (row: Row, app: DataStore) => string;
  }[];
  createFields: FormField[];
  editFields: FormField[];
  canDelete?: boolean;
};
export type DataStore = Record<string, Row[]>;
