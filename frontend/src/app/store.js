import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/admin/users/userSlice";
import api, { injectStore } from "../services/axiosInstance";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

injectStore(store);

export default store;
