import axios from "axios";

// Central API client. baseURL comes from env so deploys just set VITE_API_URL.
// withCredentials lets the httpOnly auth cookie travel with every request.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

export default api;
