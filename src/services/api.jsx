import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
export default api;

// todo Items
export async function updateTodoItemAPI(id, data) {
  const fixedData = {
    ...data,
    assignee: data.assignee.map((user) => user.id),
  };
  await api.put(`todos/todo_items/${id}/`, fixedData);
}

export async function postTodoItemAPI(data) {
  const fixedData = {
    ...data,
    assignee: data.assignee.map((user) => user.id),
  };

  const response = await api.post("todos/todo_items/", fixedData);
  return response.data;
}

export async function deleteTodoItemAPI(id) {
  await api.delete(`todos/todo_items/${id}/`);
}

// todo Lists
