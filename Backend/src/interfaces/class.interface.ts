export interface SchoolClass {
  id: number;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateClassDto {
  name: string;
  description?: string | null;
}

export interface UpdateClassDto {
  name?: string;
  description?: string | null;
}
