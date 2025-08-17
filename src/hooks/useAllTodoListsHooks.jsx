import { useQuery } from "react-query";
import { useAuth } from "../contexts/AuthContext";
import { fetchAllTodolists } from "../services/api";

export const useAllTodoLists = () => {
  const { currentUser } = useAuth();

  return useQuery({
    queryKey: ["allTodoLists"],
    queryFn: () => {
      return fetchAllTodolists(currentUser?.id);
    },
    onError: (error) =>
      console.error("API Error:", error.response?.data || error.message),

    retry: false,
    enabled: !!currentUser?.id, // Only run if currentUser is available
  });
};
