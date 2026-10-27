import type { Request, Response } from "express";
import { ClassService } from "../services/class.service.js";

const classService = new ClassService();

function isDuplicateName(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ER_DUP_ENTRY"
  );
}

function hasInvalidDescription(description: unknown): boolean {
  return description !== undefined && description !== null && typeof description !== "string";
}

export class ClassController {
  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const classes = await classService.findAll();
      res.status(200).json({ success: true, data: classes });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching classes",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    const name = req.body?.name;
    if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
      res.status(400).json({
        success: false,
        message:
          "Grade / class section name is required and must be 100 characters or fewer",
      });
      return;
    }
    if (hasInvalidDescription(req.body?.description)) {
      res.status(400).json({
        success: false,
        message: "Class description must be text",
      });
      return;
    }

    try {
      const schoolClass = await classService.create(req.body);
      res.status(201).json({
        success: true,
        message: "Class created successfully",
        data: schoolClass,
      });
    } catch (error) {
      res.status(isDuplicateName(error) ? 409 : 500).json({
        success: false,
        message: isDuplicateName(error)
          ? "A class with this name already exists"
          : "Error creating class",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ success: false, message: "Invalid class ID" });
      return;
    }
    if (
      req.body?.name !== undefined &&
      (typeof req.body.name !== "string" ||
        !req.body.name.trim() ||
        req.body.name.trim().length > 100)
    ) {
      res.status(400).json({
        success: false,
        message:
          "Grade / class section name is required and must be 100 characters or fewer",
      });
      return;
    }
    if (hasInvalidDescription(req.body?.description)) {
      res.status(400).json({
        success: false,
        message: "Class description must be text",
      });
      return;
    }

    try {
      const schoolClass = await classService.update(id, req.body);
      if (!schoolClass) {
        res.status(404).json({ success: false, message: "Class not found" });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Class updated successfully",
        data: schoolClass,
      });
    } catch (error) {
      res.status(isDuplicateName(error) ? 409 : 500).json({
        success: false,
        message: isDuplicateName(error)
          ? "A class with this name already exists"
          : "Error updating class",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ success: false, message: "Invalid class ID" });
      return;
    }

    try {
      const deleted = await classService.delete(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: "Class not found" });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Class deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting class",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
