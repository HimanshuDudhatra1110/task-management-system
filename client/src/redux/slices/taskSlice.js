import { createSlice } from "@reduxjs/toolkit";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} from "../thunks/taskThunk.js";

const initialState = {
  tasks: [],
  task: null, // for viewing/editing a single task
  stats: null,

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  },
  filters: {
    search: "",
    status: "all",
    priority: "all",
    tags: [],
    sortBy: "",
  },

  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    resetTaskState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedTask: (state) => {
      state.task = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.tasks = action.payload.tasks;
        state.pagination = action.payload.pagination;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTaskById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.task = action.payload;
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.isLoading = false;
        state.task = null;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        // Add new task to list automatically
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        // Update in list
        state.tasks = state.tasks.map((t) =>
          t._id === action.payload._id ? action.payload : t
        );

        // Update selected task
        state.task = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const id = action.payload;

        state.tasks = state.tasks.filter((t) => t._id !== id);

        // If viewing that task, remove it
        if (state.task?._id === id) {
          state.task = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getTaskStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTaskStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(getTaskStats.rejected, (state, action) => {
        state.isLoading = false;
        state.stats = null;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetTaskState, setFilters, clearSelectedTask } =
  taskSlice.actions;
export default taskSlice.reducer;
