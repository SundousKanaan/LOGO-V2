import { useQuery } from "react-query";
import { fetchCurrentUser, fetchAllUsers } from "../services/api";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: fetchCurrentUser,
    retry: false,
    enabled: false,
    onError: (error) => {
      console.error(
        "Error fetching current user:",
        error,
        error.message,
        error.response || error.toString()
      );

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
