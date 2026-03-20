import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8082/playing-ground",
});

api.interceptors.request.use(
  (config) => {
    //Should use Cookie, will implement later
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default api;
