import express from "express";
import {
  handleValidationError,
  validateLogin,
  validateRegister,
} from "../middlewares/validation.js";
import {
  loginController,
  logoutController,
  registerController,
  validateUserController,
} from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/auth.js";

const router = express.Router();

// register
router.post(
  "/register",
  validateRegister,
  handleValidationError,
  registerController
);

// login
router.post("/login", validateLogin, handleValidationError, loginController);

// validate user
router.get("/validate", authenticateUser, validateUserController);

// logout
router.post("/logout", authenticateUser, logoutController);

export default router;
