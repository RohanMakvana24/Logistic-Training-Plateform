import api from "../../../services/axiosInstance";

let AUTHPATH = "/admin/user";

/* Check Whatsapp API */
const checkWhatsapp = async (credentials) => {
  const response = await api.post(`${AUTHPATH}/check-whatsapp`, credentials);
  return response;
};

/* Create User API */
const createUser = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  const response = await api.post(`${AUTHPATH}/create-user`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

/* Fetch Users API */
const fetchUsers = async (queryParams) => {
  const response = await api.get(`${AUTHPATH}/fetch-users`, {
    params: queryParams,
  });
  return response;
};

/* Fetch User API */
const fetchUser = async (id) => {
  const response = await api.get(`${AUTHPATH}/fetch-user/${id}`);
  return response;
};

/* Resent Use API */
const resentFresherLoginRequestApi = async (id) => {
  const response = await api.get(`${AUTHPATH}/resent-fresher-login/${id}`);
  return response;
};

export default {
  checkWhatsapp,
  createUser,
  fetchUsers,
  fetchUser,
  resentFresherLoginRequestApi,
};
