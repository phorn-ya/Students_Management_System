import { ClassRepository } from "../repositories/class.repository.js";
import type {
  CreateClassDto,
  UpdateClassDto,
} from "../interfaces/class.interface.js";

export class ClassService {
  private readonly repository = new ClassRepository();

  async findAll() {
    return this.repository.findAll();
  }

  async create(data: CreateClassDto) {
    return this.repository.create({
      ...data,
      name: data.name.trim(),
      description: data.description?.trim() || null,
    });
  }

  async update(id: number, data: UpdateClassDto) {
    return this.repository.update(id, {
      ...data,
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.description !== undefined
        ? { description: data.description?.trim() || null }
        : {}),
    });
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }
}
