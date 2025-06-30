import { useQuery } from "react-query";
import api from "./api";

// get all users from the API
async function getAllUsers() {
  try {
    const response = await api.get("/users/api/");

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
    retry: false,
  });
};

// post a new user to the API
export async function postUser(userData) {
  try {
    await api.post("users/api/", userData.data);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// put (update) a user in the API
export async function putUser(req) {
  try {
    await api.put(`users/api/${req.firebase_uid}/`, req);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// delete a user from the API
export async function deleteUser(firebaseUid) {
  try {
    await api.delete(`users/api/${firebaseUid}/`);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
