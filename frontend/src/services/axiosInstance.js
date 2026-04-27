import axios from "axios";
import { clearAuth } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

let store;
export const injectStore = (_store) => {
  store = _store;
};

/** Attach Token */
api.interceptors.request.use((config) => {
  const token = store?.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Handle Expired Token */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = store.getState().auth.refreshToken;

        const res = await axios.post("http://127.0.0.1:8000/api/auth/refresh", {
          refresh_token: refreshToken,
        });

        const newToken = res.data.accessToken;
        console.log(newToken);

        localStorage.setItem("accessToken", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        store.dispatch(clearAuth());
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
