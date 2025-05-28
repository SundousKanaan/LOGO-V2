import { useQuery } from "react-query";
import { useAuth } from "../contexts/AuthContext";
import api from "./api";

async function getTodolists(id) {
  const userUid = id.id;
  try {
    const response = await api.get(
      `/todos/todo_lists/user_lists/${userUid}/?expand=items.assignee`
    );
    console.log("++ API Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("++ API Error:", error.response?.data || error.message);
    throw error;
  }
}

export const useTodolists = () => {
  const { currentUser } = useAuth();
  return useQuery({
    queryKey: ["dbTodolists"],
    queryFn: () => getTodolists({ id: currentUser?.uid }),
    retry: false,
    enabled: !!currentUser,
  });
};
