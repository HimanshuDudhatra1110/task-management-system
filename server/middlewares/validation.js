import { body, param, query, validationResult } from "express-validator";

// Middleware to check validation errors
export const handleValidationError = (req, res, next) => {
  const errors = validationResult(req);

  // check if errors are present
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message:
        "Validation errors: " +
        errors
          .array()
          .map((err) => err.msg)
          .join(", "),
      errors: errors.array(),
    });
  }
  next();
};

// validation for a POST register
export const validateRegister = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name").trim().notEmpty().withMessage("Name is required"),
];

// validation for a POST login
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// validation for POST create task
export const validateCreateTask = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("status")
    .optional({ checkFalsy: true })
    .isIn(["todo", "in-progress", "completed"])
    .withMessage("Invalid status"),
  body("priority")
    .optional({ checkFalsy: true })
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),
  body("dueDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Invalid date format"),
  body("tags")
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage("Tags must be an array"),
  body("assignedToEmail")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email format"),
];

// validation for PATCH edit task
export const validateEditTask = [
  param("id").isMongoId().withMessage("Invalid task ID"),
  body("title")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("status")
    .optional({ checkFalsy: true })
    .isIn(["todo", "in-progress", "completed"])
    .withMessage("Invalid status"),
  body("priority")
    .optional({ checkFalsy: true })
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),
  body("dueDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Invalid date format"),
  body("tags")
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage("Tags must be an array"),
  body("assignedToEmail")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email format"),
];

// task id validation for GET and DELETE task
export const validateTaskId = [
  param("id").isMongoId().withMessage("Invalid task ID"),
];

// query validation in getting all task
export const validateGetTasksPagination = [
  query("page")
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];
