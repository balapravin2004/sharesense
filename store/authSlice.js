import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

import { resetFilterMode } from "./notesSlice";

import { useDispatch } from "react-redux";

// Save full user and token
const saveAuthData = (user, token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authUser", JSON.stringify(user));
    localStorage.setItem("authToken", token);
  }
};

// Remove user and token
const removeAuthData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
  }
};

// Get saved user and token
const getAuthData = () => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("authUser");
    const storedToken = localStorage.getItem("authToken");
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      token: storedToken || null,
    };
  }
  return { user: null, token: null };
};

// Signup action
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/signup", data);
      toast.success("Signup successful! 😄😄");
      return { user: res.data.user, token: res.data.token };
    } catch (error) {
      toast.error(error.response?.data?.error || "Signup failed");
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

// Login action
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/login", data);
      toast.success("Logged in successfully!");
      return { user: res.data.user, token: res.data.token };
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
      return rejectWithValue(error.response?.data?.error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    toast.success("Logged out successfully!");
    removeAuthData();
    dispatch(resetFilterMode());

    return null;
  }
);

// Initial state
const { user, token } = getAuthData();
const initialState = {
  user: user,
  token: token,
  activeTab: "signup",
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        saveAuthData(action.payload.user, action.payload.token);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        saveAuthData(action.payload.user, action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        removeAuthData();
      });
  },
});

export const selectUser = (state) => state.auth.user;
export const { setActiveTab } = authSlice.actions;
export default authSlice.reducer;
