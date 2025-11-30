import express, { json } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import Task from "./models/taskModel.js";

// Load environment variables from.env file
dotenv.config();

const app = express();

// global error handler
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser()); // Enable cookie parsing
app.use(helmet()); // Security headers

// request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Management API Server is running",
    version: "1.0.0",
    timestamp: new Date(),
  });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB with retry logic
const connectDB = async () => {
  let retryCount = 0;
  while (retryCount < 5) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`Connected to MongoDB: ${conn.connection.host}`);
      break;
    } catch (err) {
      console.error(
        `Failed to connect to MongoDB. Retrying in 5 seconds... (${
          retryCount + 1
        }/5) : `
      );
      retryCount++;
      setTimeout(connectDB, 5000);
    }
  }
};

// Start the server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
