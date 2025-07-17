import { useQuery, useMutation } from "react-query";
import {
  fetchCurrentUser,
  fetchAllUsers,
  validateProfile,
  // validateLogin, to delete
} from "../services/api";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: fetchCurrentUser,
    retry: false,
    enabled: false,
    onError: (error) => {
      console.error("fetchCurrentUser API Error:", error);
      throw error;
    },
  });
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: fetchAllUsers,
    retry: false,
    onError: (error) => {
      console.error("getAllUsers API Error:", error);
      throw error;
    },
  });
};

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
// to delete
// export function useServerValidateLogin() {
//   return useMutation({
//     mutationFn: validateLogin,
//     onSuccess: () => {
//       return { success: true };
//     },
//     onError: (err) => {
//       return {
//         success: false,
//         errors: err.response?.data?.errors || {},
//       };
//     },
//   });
// }
