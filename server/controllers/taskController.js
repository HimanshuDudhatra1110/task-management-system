import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

export const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = { createdBy: req.user._id };

    // Filter by status
    if (req.query.status && req.query.status !== "all") {
      query.status = req.query.status;
    }

    // Filter by priority
    if (req.query.priority && req.query.priority !== "all") {
      query.priority = req.query.priority;
    }

    // Search in title and description
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Filter by tags
    if (req.query.tags) {
      const tagsArray = req.query.tags.split(",");
      query.tags = { $in: tagsArray };
    }

    // Sorting
    let sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default: newest first
    }
    // Execute query
    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("assignedTo", "name email");

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error getting tasks :", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email"
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user owns the task or is assigned to it
    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      task.assignedTo?.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this task" });
    }

    res.status(200).json({
      success: true,
      data: task,
      message: "Task fetched successfully",
    });
  } catch {
    console.error("Error getting task :", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { assignedToEmail, ...taskData } = req.body;

    // If task is assigned to someone, find that user
    if (assignedToEmail) {
      const assignedUser = await User.findOne({ email: assignedToEmail });
      if (assignedUser) {
        taskData.assignedTo = assignedUser._id;
      }
      taskData.assignedToEmail = assignedToEmail;
    }

    // Create task
    let task = await Task.create({
      ...taskData,
      createdBy: req.user._id,
    });

    // Populate if needed
    if (taskData.assignedTo) {
      task = await Task.findById(task._id).populate("assignedTo", "name email");
    }

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Error creating task :", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user owns the task
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    const { assignedToEmail, ...updateData } = req.body;

    // If user is updating assigned user
    if (assignedToEmail) {
      const assignedUser = await User.findOne({ email: assignedToEmail });
      if (assignedUser) {
        updateData.assignedTo = assignedUser._id;
      }
      updateData.assignedToEmail = assignedToEmail;
    }

    task = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      data: task,
      message: "Task edited successfully",
    });
  } catch (error) {
    console.error("Error editing task :", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user owns the task
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task :", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStats = async (req, res) => {
  try {
    // agregation to get needed stats
    const stats = await Task.aggregate([
      { $match: { createdBy: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $ne: ["$status", "completed"] }, 1, 0] },
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] },
          },
        },
      },
    ]);
    res.status(200).json({
      success: true,
      data: stats[0] || {
        total: 0,
        completed: 0,
        pending: 0,
        highPriority: 0,
      },
      message: "stats generated successfully",
    });
  } catch (error) {
    console.error("Error generating stat of tasks :", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
