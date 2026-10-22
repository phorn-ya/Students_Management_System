export class Department {
  id?: number;
  name: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<Department>) {
    this.id = data.id;
    this.name = data.name!;
    this.description = data.description ?? null;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
