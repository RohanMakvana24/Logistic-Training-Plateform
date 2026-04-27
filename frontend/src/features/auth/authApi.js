import axios from "axios";
import api from "../../services/axiosInstance";

let AUTHPATH = "/auth";

/* Login API */
const loginApi = async (credentials) => {
  const response = await api.post(`${AUTHPATH}/login-api`, credentials);
  return response;
};

/* Login API */
const fresherLoginApi = async (url, credentials) => {
  const response = await api.post(`${url}`, credentials);
  return response;
};

/* Logout API */
const logoutApi = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await api.post(`${AUTHPATH}/logout-api`);
  return response;
};

/* Refresh */
const refreshApi = async (refreshToken) => {
  return await axios.post("http://127.0.0.1:8000/api/auth/refresh", {
    refresh_token: refreshToken,
  });
};

export default {
  loginApi,
  logoutApi,
  refreshApi,
  fresherLoginApi,
};
