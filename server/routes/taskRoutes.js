import express from "express";
import {
  handleValidationError,
  validateCreateTask,
  validateEditTask,
  validateGetTasksPagination,
  validateTaskId,
} from "../middlewares/validation.js";
import {
  createTask,
  deleteTask,
  editTask,
  getStats,
  getTaskById,
  getTasks,
} from "../controllers/taskController.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

// get all tasks with filter
router.get(
  "/",
  authenticateUser,
  validateGetTasksPagination,
  handleValidationError,
  getTasks
);

// get stats for dashboard
router.get("/stats", authenticateUser, getStats);

// get task by id
router.get(
  "/:id",
  authenticateUser,
  validateTaskId,
  handleValidationError,
  getTaskById
);

// create task
router.post(
  "/",
  authenticateUser,
  validateCreateTask,
  handleValidationError,
  createTask
);

// edit task
router.patch(
  "/:id",
  authenticateUser,
  validateEditTask,
  handleValidationError,
  editTask
);

// delete task
router.delete(
  "/:id",
  authenticateUser,
  validateTaskId,
  handleValidationError,
  deleteTask
);

export default router;
