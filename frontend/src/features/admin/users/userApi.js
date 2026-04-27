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

/* Update User API */
const updateUser = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "profile") {
      if (data.profile instanceof File) {
        formData.append("profile", data.profile);
      }
    } else {
      formData.append(key, data[key] ?? "");
    }
  });

  formData.append("_method", "PUT");

  const response = await api.post(`${AUTHPATH}/update-user`, formData);
  return response;
};

/* Resent Use API */
const resentFresherLoginRequestApi = async (id) => {
  const response = await api.get(`${AUTHPATH}/resent-fresher-login/${id}`);
  return response;
};

/* Delete User API */
const deleteUser = async (id) => {
  const response = await api.delete(`${AUTHPATH}/delete-user/${id}`);
  return response;
};

/* Generate Users Pdf API */
const generatePdf = async (data) => {
  const response = await api.post(
    `${AUTHPATH}/generate-pdf`,
    { data: data },
    {
      responseType: "blob",
    },
  );
  return response;
};

export default {
  checkWhatsapp,
  createUser,
  fetchUsers,
  fetchUser,
  updateUser,
  resentFresherLoginRequestApi,
  deleteUser,
  generatePdf,
};
