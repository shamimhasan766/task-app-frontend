import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log(error.response);
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      router.push("/");

      //   window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
