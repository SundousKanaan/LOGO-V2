import { useQuery, useMutation } from "react-query";
import { useAuth } from "../contexts/AuthContext";
import api from "./api";

// get all todo lists for a user
async function getTodolistsArray(data) {
  try {
    const response = await api.get(
      `/todos/todo_lists/user/${data.id}/?fields=${data.fields.join(",")}`
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
}

export const useTodolistsArray = (fields) => {
  const { currentUser } = useAuth();

  return useQuery({
    queryKey: ["todolistsArray", fields],
    queryFn: () => getTodolistsArray({ id: currentUser?.id, fields: fields }),
    retry: false,
    enabled: !!currentUser,
  });
};

// get details of a specific todo list
async function getListDetails(id) {
  try {
    setTimeout(() => {

    }, 5000)
    const response = await api.get(
      `/todos/todo_lists/${id}/?expand=items.assignee,owner`
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

export function useCreateTodoList() {
  async function postTodoList(req) {
    const postRequest = {
      title: req?.title,
      owner: req?.owner,
      items: [],
    };

    await api.post("todos/todo_lists/", postRequest);
  }

  return useMutation({
    mutationFn: postTodoList,
    onError: (err) => {
      console.error(
        "Error with creating new list",
        err.response?.data || err.message
      );
    },
  });
}

export function useUpdateTodoList() {
  async function updateTodoList(req) {
    await api.put(`todos/todo_lists/${req.id}/`, req);
  }

  return useMutation({
    mutationFn: updateTodoList,
    onError: (err) => {
      console.error(
        "Error with creating new list",
        err.response?.data || err.message
      );
    },
  });
}

export function useDeleteTodoList() {
  async function deleteTodoList(id) {
    await api.delete(`todos/todo_lists/${id}/`);
  }
  return useMutation({
    mutationFn: deleteTodoList,
    onError: (err) => {
      console.error(
        "Error with creating new list",
        err.response?.data || err.message
      );
    },
  });
}
