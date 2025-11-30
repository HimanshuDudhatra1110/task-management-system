import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

export const getTasks = createAsyncThunk(
  "tasks/getTasks",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/tasks", { params: queryParams });

      if (res?.data?.success && Array.isArray(res?.data?.data)) {
        return {
          tasks: res.data.data,
          pagination: res.data.pagination,
        };
      }

      return rejectWithValue(res?.data?.message || "Failed to fetch tasks");
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

export const getTaskById = createAsyncThunk(
  "tasks/getTaskById",
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/tasks/${taskId}`);

      if (res?.data?.success && res?.data?.data) {
        return res.data.data;
      }

      return rejectWithValue(res?.data?.message || "Failed to fetch task");
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch task"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const res = await api.post("/tasks", taskData);

      if (res?.data?.success && res?.data?.data) {
        return res.data.data;
      }

      return rejectWithValue(res?.data?.message || "Failed to create task");
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to create task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/tasks/${id}`, updates);

      if (res?.data?.success && res?.data?.data) {
        return res.data.data;
      }

      return rejectWithValue(res?.data?.message || "Failed to update task");
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/tasks/${taskId}`);

      if (res?.data?.success) {
        return taskId; // return ID so reducer can remove it
      }

      return rejectWithValue(res?.data?.message || "Failed to delete task");
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

export const getTaskStats = createAsyncThunk(
  "tasks/getTaskStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/tasks/stats");

      if (res?.data?.success && res?.data?.data) {
        return res.data.data;
      }

      return rejectWithValue(res?.data?.message || "Failed to fetch stats");
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);
