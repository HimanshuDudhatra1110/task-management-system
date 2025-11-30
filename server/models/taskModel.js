import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a task title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide a task description"],
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  status: {
    type: String,
    enum: ["todo", "in-progress", "completed"],
    default: "todo",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  dueDate: {
    type: Date,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assignedToEmail: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
taskSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

// Index for better query performance
taskSchema.index({ title: "text", description: "text" });
taskSchema.index({ createdBy: 1, status: 1 });
taskSchema.index({ createdAt: -1 });

const Task = mongoose.model("Task", taskSchema);
export default Task;
