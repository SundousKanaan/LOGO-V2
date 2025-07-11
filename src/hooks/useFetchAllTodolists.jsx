import { useQuery } from "react-query";
import { useAuth } from "../contexts/AuthContext";
import { getAllTodolistsAPI } from "../services/api";

export const useFetchAllTodolists = () => {
  const { currentUser } = useAuth();

  return useQuery({
    queryKey: ["todolistsArray"],
    queryFn: () => {
      return getAllTodolistsAPI(currentUser?.id);
    },
    onError: (error) =>
      console.error("API Error:", error.response?.data || error.message),

    retry: false,
    enabled: !!currentUser,
  });
};
