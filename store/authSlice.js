import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

// Helper to save token in localStorage
const saveToken = (token) => {
  localStorage.setItem("authToken", token);
};

// Helper to remove token from localStorage
const removeToken = () => {
  localStorage.removeItem("authToken");
  console.log("Token removed on logout");
};

// Helper to get token from localStorage
const getToken = () => {
  return localStorage.getItem("authToken");
};

// Signup action - returns user and token same as login
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/signup", data);
      toast.success("Signup successful! Logging you in...");
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

// Logout action
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    await axios.post("/api/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  }
  toast.success("Logged out successfully!");
  removeToken();
  return null;
});

// Initial state with token from localStorage
const initialState = {
  user: null,
  token: getToken(),
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
        saveToken(action.payload.token); // ✅ Save token after signup
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
        saveToken(action.payload.token); // ✅ Save token after login
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        removeToken(); // ✅ Clear token on logout
      });
  },
});

export const { setActiveTab } = authSlice.actions;
export default authSlice.reducer;
