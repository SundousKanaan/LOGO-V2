import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.0.199:8000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// requests check!
// Log when request starts
// api.interceptors.request.use(
//   (config) => {
//     console.log(
//       `[API] Request START: ${config.method?.toUpperCase()} ${config.baseURL}${
//         config.url
//       }`
//     );
//     console.log("[API] Request headers:", config.headers);
//     console.log("[API] Request data:", config.data);
//     return config;
//   },
//   (error) => {
//     console.error("[API] Request ERROR before sending:", error);
//     return Promise.reject(error);
//   }
// );

// Log when response comes back
// api.interceptors.response.use(
//   (response) => {
//     console.log(
//       `[API] Response SUCCESS: ${response.status} ${response.config.url}`
//     );
//     console.log("[API] Response data:", response.data);
//     return response;
//   },
//   (error) => {
//     console.error(
//       `[API] Response ERROR for ${error.config?.url || "unknown URL"}`
//     );
//     console.error("[API] Error message:", error.message);
//     console.error("[API] Error response:", error.response?.data);
//     return Promise.reject(error);
//   }
// );

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// todo Lists
export async function fetchAllTodolists(id) {
  const response = await api.get(
    `/todos/todo_lists/user/${id}/?fields=id,title,owner,items&expand=items.assignee,items.todo_list`
  );
  return response.data;
}

export async function postTodoList(data) {
  const postRequest = {
    title: data.title,
    owner: data.owner,
    items: [],
  };
  const res = await api.post("todos/todo_lists/", postRequest);
  return res.data;
}

export async function updateTodoList(data) {
  const res = await api.put(`todos/todo_lists/${data.id}/`, data);
  return res.data;
}

export async function deleteTodoList(id) {
  const res = await api.delete(`todos/todo_lists/${id}/`);
  return res.data;
}

// todo Items
export async function postTodoItem(data) {
  const fixedData = {
    ...data,
    assignee: data.assignee.map((user) => user.id),
  };

  const response = await api.post("todos/todo_items/", fixedData);
  return response.data;
}

export async function updateTodoItem(id, data) {
  const fixedData = {
    ...data,
    assignee: data.assignee.map((user) => user.id),
    todo_list: data.todo_list.id,
  };
  await api.put(`todos/todo_items/${id}/`, fixedData);
}

export async function deleteTodoItem(id) {
  await api.delete(`todos/todo_items/${id}/`);
}

// user
export async function fetchCurrentUser() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const response = await api.get("/users/me/");
  return response.data[0];
}

export async function fetchAllUsers() {
  const response = await api.get("/users/api/");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return response.data;
}

export async function postUser(data) {
  const res = await api.post("users/api/", data);
  return res.data;
}

export async function updateUser(req) {
  const res = await api.put(`users/api/${req.id}/`, req);
  return res.data;
}

export async function deleteUser(id) {
  const req = await api.delete(`users/api/${id}/`);
  return req;
}

// products
export async function fetchProducts({ pageParam = 1, maxProductPage = 10 }) {
  const response = await api.get(
    `/products/api/?page=${pageParam}&limit=${maxProductPage}`
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return response.data;
}
