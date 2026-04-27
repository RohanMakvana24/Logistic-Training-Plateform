import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userApi from "./userApi";

/** Check Whatsapp Number API AsyncThunk **/
export const CheckWhatsappThunk = createAsyncThunk(
  "user/check-whatsapp",
  async (credentials, thunkAPI) => {
    try {
      const response = await userApi.checkWhatsapp(credentials);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

/** Create User API AsyncThunk **/
export const CreateUserThunk = createAsyncThunk(
  "user/create",
  async (data, thunkAPI) => {
    try {
      const response = await userApi.createUser(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

/** Fetch Users API AsyncThunk **/
export const FetchUsersThunk = createAsyncThunk(
  "user/fetch",
  async (queryParams, thunkAPI) => {
    try {
      const response = await userApi.fetchUsers(queryParams);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

/** Fetch Users API AsyncThunk **/
export const ResentFresherLogin = createAsyncThunk(
  "user/resent-fresher-login",
  async (id, thunkAPI) => {
    try {
      const response = await userApi.resentFresherLoginRequestApi(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

/** Fetch Users API AsyncThunk **/
export const FetchUserThunk = createAsyncThunk(
  "user/fetch-single",
  async (id, thunkAPI) => {
    try {
      const response = await userApi.fetchUser(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

/** Delete User API AsyncThunk **/
export const DeleteUserThunk = createAsyncThunk(
  "user/delete",
  async (id, thunkAPI) => {
    try {
      const response = await userApi.deleteUser(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

/** Fetch Users API AsyncThunk **/
export const UpdateUserThunk = createAsyncThunk(
  "user/update",
  async (data, thunkAPI) => {
    try {
      const response = await userApi.updateUser(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

/** Generate PDF API AsyncThunk **/
export const GeneratePdfThunk = createAsyncThunk(
  "user/generate-pdf",
  async (data, thunkAPI) => {
    try {
      const response = await userApi.generatePdf(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    message: "",
    users: [],
    user: null,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    /** Checkwhatsapp API Builder */
    builder
      .addCase(CheckWhatsappThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CheckWhatsappThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(CheckWhatsappThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    /** Create User API Builder */
    builder
      .addCase(CreateUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(CreateUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(CreateUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    /** Fetch Users API Builder */
    builder
      .addCase(FetchUsersThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(FetchUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.users = action.payload.users;
      })
      .addCase(FetchUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    /** Fetch User API Builder */
    builder
      .addCase(FetchUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(FetchUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.user = action.payload.user;
      })
      .addCase(FetchUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    /** Resent Fresher Login Builder */
    builder
      .addCase(ResentFresherLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ResentFresherLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(ResentFresherLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    /** Update User  Builder */
    builder
      .addCase(UpdateUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(UpdateUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(UpdateUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    /** Delete User Builder */
    builder
      .addCase(DeleteUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(DeleteUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(DeleteUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    /**  Generate Pdf Builder */
    builder
      .addCase(GeneratePdfThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GeneratePdfThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(GeneratePdfThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong";
      });
  },
});

export default userSlice.reducer;
