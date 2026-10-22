export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student'
}

export class User {
  id?: number;
  username: string;
  password?: string;
  email: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<User>) {
    this.id = data.id;
    this.username = data.username!;
    this.password = data.password;
    this.email = data.email!;
    this.role = data.role!;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
