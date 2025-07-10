import { useQuery } from "react-query";
import { useAuth } from "../contexts/AuthContext";
import api from "./api";

// get all todo lists for a user
async function getAllTodolistsAPI(id) {
  const response = await api.get(
    `/todos/todo_lists/user/${id}/?fields=id,title,owner,items&expand=items.assignee,items.todo_list`
  );
  return response.data;
}

export const useGetAllTodolistsAPI = () => {
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

// ===========

export async function postTodoListAPI(data) {
  const postRequest = {
    title: data.title,
    owner: data.owner,
    items: [],
  };

  await api.post("todos/todo_lists/", postRequest);
}

export async function updateTodoListAPI(data) {
  await api.put(`todos/todo_lists/${data.id}/`, data);
}

export async function deleteTodoListAPI(id) {
  await api.delete(`todos/todo_lists/${id}/`);
}
