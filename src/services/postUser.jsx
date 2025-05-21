import api from "./api";

export async function postUser(userData) {
  try {
    await api.post("users/api/", userData.data);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
