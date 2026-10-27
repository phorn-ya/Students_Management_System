import { Router } from "express";
import { ClassController } from "../controllers/class.controller.js";

const router = Router();
const classController = new ClassController();

router.get("/", classController.getAll.bind(classController));
router.post("/", classController.create.bind(classController));
router.put("/:id", classController.update.bind(classController));
router.delete("/:id", classController.delete.bind(classController));

export default router;
