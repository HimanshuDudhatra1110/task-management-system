import api from "../../api/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/validate");

      if (res?.data?.success && res?.data?.user) {
        return res.data.user;
      }
      return rejectWithValue("Not authenticated");
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Not authenticated"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", userData);

      if (res?.data?.success && res?.data?.user) {
        return res.data.user;
      }
      return rejectWithValue(res?.data?.message || "Registartion failed");
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Registartion failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", userData);

      if (res?.data?.success && res?.data?.user) {
        return res.data.user;
      }
      return rejectWithValue(res?.data?.message || "Invalid Credentials");
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Login failed");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await api.post("/auth/logout");
  return true;
});
