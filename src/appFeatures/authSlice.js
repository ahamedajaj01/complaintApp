import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../appwrite/authService";

// Create an async  thunk for dispatching different actions based on the authentication state

// 1: 🔐 Signup Thunk using createAsyncThunk from Redux Toolkit

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      // Step 1: Call Appwrite's createUser API to register a new user
      await authService.createUser({ name, email, password });
      //  step:2 after successful signup, fetch current user from data
      const user = await authService.getCurrentUser();
      return user;
    } catch (error) {
      // ❌ If any error occurs (e.g., email already taken), send the error to be handled in rejected case
      return rejectWithValue(error.message);
    }
  }
);

// 2:  🔐 Login Thunk using createAsyncThunk from Redux Toolkit
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await authService.loginUser({ email, password });
      const user = await authService.getCurrentUser();
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3:  🔐 logout Thunk using createAsyncThunk from Redux Toolkit
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await authService.logoutUser();
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 4: Fetch current user Thunk using createAsyncThunk from Redux Toolkit
// This is useful to check if a user is logged in when the app starts

export const checkCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        return thunkAPI.rejectWithValue("No user logged in");
      }
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  isAuthenticated: false,
  userData: null,
  role: null,
  isLoading: false,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  authReady: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userData = action.payload.userData;
      state.status = "succeeded";
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
      state.status = "idle";
      state.error = null;
    },
  },

  //  Handle async thunk states (pending, fulfilled, rejected)

  extraReducers: (builder) => {
    builder
      // 1: 🔄 When signupUser thunk is triggered but not yet completed
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.userData = null;
      })
      // ✅ When signupUser is successful
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true; // Mark user as authenticated
        state.userData = action.payload; // Store user info from Appwrite
        state.role = action.payload?.prefs?.role || "user";
      })
      // When signupUser fails (e.g., email in use, server error)
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false; // Ensure auth is false if signup fails
        state.userData = null;
        state.isLoading = false;
        state.error = action.payload; // Store error message for UI
      })
      // 2: 🔄 When loginUser thunk is triggered but not yet completed
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.isLoading = true;
      })

      // ✅ When loginUser is successful
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.userData = action.payload;
        state.role = action.payload?.prefs?.role || "user";
        state.isLoading = false;
        state.authReady = true;
      })

      // ❌ When loginUser fails (e.g., wrong password)
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.userData = null;
        state.error = action.payload;
        state.isLoading = false;
        state.authReady = true; // Mark auth as ready even if no user is found
      })

      // 3: When logoutUser is triggered
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "idle";
        state.isAuthenticated = false;
        state.userData = null;
        state.error = null;
        state.authReady = true; // Mark auth as ready after logout
        state.role = null;
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.authReady = true; // Mark auth as ready even if no user is found
      })

      // 4: When checkCurrentUser is triggered
      .addCase(checkCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        
      })
      .addCase(checkCurrentUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthenticated = true;
        state.role = action.payload?.prefs?.role || "user";
        state.status = "succeeded";
        state.isLoading = false; // <--- stop loading
        state.error = null;
        state.authReady = true; // Mark auth as ready
      })
      .addCase(checkCurrentUser.rejected, (state, action) => {
        state.userData = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.isLoading = false;
        state.error = action.payload; // Store error message for UI
        state.authReady = true; // Mark auth as ready even if no user is found
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
