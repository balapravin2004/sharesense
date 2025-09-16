import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const saveAuthData = (id, token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authId", id);
    localStorage.setItem("authToken", token);
  }
};

const removeAuthData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authId");
    localStorage.removeItem("authToken");
    console.log("Token and ID removed on logout");
  }
};

const getAuthData = () => {
  if (typeof window !== "undefined") {
    return {
      id: localStorage.getItem("authId"),
      token: localStorage.getItem("authToken"),
    };
  }
  return { id: null, token: null };
};

// Signup action
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
  removeAuthData();
  return null;
});

// Initial state
const { id, token } = getAuthData();
const initialState = {
  user: id ? { id } : null, // Only id is saved persistently; name and email are lost on refresh unless refetched
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
        saveAuthData(action.payload.user.id, action.payload.token);
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
        saveAuthData(action.payload.user.id, action.payload.token);
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
