import { useQuery, useMutation } from "react-query";
import api from "./api";

// get current user details
async function getCurrentUserDetails() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const response = await api.get("/users/me/");
    return response.data;
  } catch (error) {
    console.error("getUserDetails API Error:", error);
    throw error;
  }
}

export const useCurrentUserDetails = () => {
  return useQuery({
    queryKey: ["userDetails"],
    queryFn: getCurrentUserDetails,
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

// get user details
export async function getUserData(id) {
  if (!id) return;
  const response = await api.get(`/users/api/${id}`);
  return response.data;
}

export const useUserData = (id) => {
  return useQuery({
    queryKey: ["userDetails", id],
    queryFn: () => getUserData(id),
    onError: (error) => {
      console.error("getUserDetails API Error:", error);
    },
    retry: false,
    enabled: !!id,
  });
};

// post a new user to the API
export function useCreateUser() {
  async function postUser(userData) {
    await api.post("users/api/", userData);
  }

  return useMutation({
    mutationFn: postUser,
    onError: (err) => {
      console.error(
        "Error with creating new user",
        err.response?.data || err.message
      );
    },
  });
}

// put (update) a user in the API
export function useUpdateUser() {
  async function putUser(req) {
    await api.put(`users/api/${req.id}/`, req);
  }

  return useMutation({
    mutationFn: putUser,
    onError: (err) => {
      console.error(
        "Error with updating the user",
        err.response?.data || err.message
      );
    },
  });
}

// delete a user from the API
export function useDeleteUser() {
  async function deleteUser(id) {
    await api.delete(`users/api/${id}/`);
  }

  return useMutation({
    mutationFn: deleteUser,
    onError: (err) => {
      console.error(
        "Error with deleting this user.",
        err.response?.data || err.message
      );
    },
  });
}

// validate user details
export function useValidateProfile() {
  async function validateProfile(req) {
    const data = {
      first_name: req.first_name,
      last_name: req.last_name,
      phone: req.phone || "",
      birthday: req.birthday,
      email: req.email,
    };
    await api.post("/users/validate-profile/", data);
  }

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
