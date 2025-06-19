import { useQuery } from "react-query";
import api from "../api";

async function getListDetails(id) {
  try {
    const response = await api.get(
      `/todos/todo_lists/list/${id}/?expand=items.assignee,owner`
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
}

export const useListDetails = (id) => {
  return useQuery({
    queryKey: ["todolistDetails", id],
    queryFn: () => getListDetails(id),
    retry: false,
    enabled: false,
  });
};
