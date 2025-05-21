import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const setAuthToken = (token) => {
  // Set the token in the header for all requests
  if (!token) {
    // If no token is provided, remove the token from the header
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // If a token is provided, set it in the header
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
