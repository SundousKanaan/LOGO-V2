import { useQuery } from "react-query";
import { useAuth } from "../contexts/AuthContext";
import api from "./api";

export async function postTodoList(req) {
  const postRequest = {
    title: req.title,
    owner: req.owner,
    items: [],
  };
  try {
    await api.post("todos/todo_lists/", postRequest);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function updateTodoList(req) {
  try {
    await api.put(`todos/todo_lists/${req.id}/`, req);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function deleteTodoList(id) {
  try {
    await api.delete(`todos/todo_lists/${id}/`);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// get all todo lists for a user
async function getTodolistsArray(data) {
  const userUid = data.id;
  try {
    const response = await api.get(
      `/todos/todo_lists/user_lists/${userUid}/?fields=${data.fields.join(",")}`
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
    queryFn: () => getTodolistsArray({ id: currentUser?.uid, fields: fields }),
    retry: false,
    enabled: !!currentUser,
  });
};

// get details of a specific todo list
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
