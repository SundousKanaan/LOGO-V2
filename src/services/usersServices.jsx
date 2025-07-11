import { useQuery, useMutation } from "react-query";
import { api } from "./api";

// get current user details
async function getCurrentUser() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const response = await api.get("/users/me/");
    return response.data;
  } catch (error) {
    console.error("getUserDetails API Error:", error);
    throw error;
  }
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["userDetails"],
    queryFn: getCurrentUser,
    retry: false,
    enabled: false,
  });
};

// get all users from the API
async function getAllUsers() {
  try {
    const response = await api.get("/users/api/");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return response.data;
  } catch (error) {
    console.error("getAllUsers API Error:", error);
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
export async function createtUser(userData) {
  await api.post("users/api/", userData);
}

export function useCreateUser() {
  return useMutation({
    mutationFn: createtUser,
    onError: (err) => {
      console.error(
        "Error with creating new user",
        err.response?.data || err.message
      );
    },
  });
}

// put (update) a user in the API
export async function updateUserAPI(req) {
  const res = await api.put(`users/api/${req.id}/`, req);
  return res.data;
}

// delete a user from the API
export async function deleteUserAPI(id) {
  const req = await api.delete(`users/api/${id}/`);
  console.log({ req });

  return req;
}

export async function validateProfile(req) {
  const data = {
    first_name: req.first_name,
    last_name: req.last_name,
    phone: req.phone || "",
    birthday: req.birthday,
    email: req.email,
  };
  await api.post("/users/validate-profile/", data);
}

// validate user details
export function useValidateProfile() {
  return useMutation({
    mutationFn: validateProfile,
    onSuccess: () => {
      return { success: true };
    },
    onError: (err) => {
      return {
        success: false,
        errors: err.response?.data?.errors || {},
      };
    },
  });
}

// validate login
export function useValidateLogin() {
  async function validateLogin(req) {
    await api.post("/users/validate-login/", req);
  }

  return useMutation({
    mutationFn: validateLogin,
    onSuccess: () => {
      return { success: true };
    },
    onError: (err) => {
      return {
        success: false,
        errors: err.response?.data?.errors || {},
      };
    },
  });
}
