import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "./authApi";

/** Login API AsyncThunk **/
export const LoginAsyncThunk = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await authApi.loginApi(credentials);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

/** Logout API AsyncThunk **/
export const LogoutAsyncThunk = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const response = await authApi.logoutApi();
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

/** Logout API AsyncThunk **/
export const FresherLoginThunk = createAsyncThunk(
  "auth/fresher-login",
  async ({ url, password }, thunkAPI) => {
    try {
      const response = await authApi.fresherLoginApi(url, {
        password,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoading: false,
    message: "",
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : "",
    accessToken: localStorage.getItem("accessToken")
      ? localStorage.getItem("accessToken")
      : "",
    refreshToken: localStorage.getItem("refreshToken")
      ? localStorage.getItem("refreshToken")
      : "",
    error: "",
  },
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    /** Login API Builder */
    builder
      .addCase(LoginAsyncThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LoginAsyncThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem("accessToken", state.accessToken);
        localStorage.setItem("refreshToken", state.refreshToken);
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(LoginAsyncThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });

    /** Logout API Builder */
    builder
      .addCase(LogoutAsyncThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LogoutAsyncThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      })
      .addCase(LogoutAsyncThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    /** Fresher Login API Builder */
    builder
      .addCase(FresherLoginThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(FresherLoginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem("accessToken", state.accessToken);
        localStorage.setItem("refreshToken", state.refreshToken);
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(FresherLoginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuth, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
