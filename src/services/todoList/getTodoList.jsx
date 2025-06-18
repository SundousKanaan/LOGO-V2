import { useQuery } from "react-query";
import api from "../api";

async function getTodoList(id) {
  try {
    const response = await api.get(
      `/todos/todo_lists/list/${id}/?expand=items.assignee,owner`
    );
    // console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
}

export const useTodolist = (id) => {
  return useQuery({
    queryKey: ["dbTodolist", id],
    queryFn: () => getTodoList(id),
    retry: false,
    enabled: !!id,
  });
};
