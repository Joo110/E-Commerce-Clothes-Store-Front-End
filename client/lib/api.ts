import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "https://localhost:7020",
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    // ✅ تأكد إن headers موجودة قبل الإضافة
    if (!config.headers) {
      config.headers = {};
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;