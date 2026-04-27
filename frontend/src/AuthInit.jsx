import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAccessToken, clearAuth } from "./features/auth/authSlice";

const AuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");

    const refreshAccessToken = async () => {
      if (!refreshToken) return;

      try {
        const res = await axios.post("http://127.0.0.1:8000/api/auth/refresh", {
          refresh_token: refreshToken,
        });

        const newToken = res.data.accessToken;

        localStorage.setItem("accessToken", newToken);
        dispatch(setAccessToken(newToken));
      } catch (err) {
        dispatch(clearAuth());
      }
    };

    refreshAccessToken();
  }, []);

  return null;
};

export default AuthInit;
