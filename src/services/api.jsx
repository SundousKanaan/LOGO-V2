import axios from "axios";

export const api = axios.create({
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
  await api.delete(`todos/todo_lists/${id}/`);
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

export async function postUser(userData) {
  const res = await api.post("users/api/", userData);
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

export async function validateProfile(req) {
  const data = {
    first_name: req.first_name,
    last_name: req.last_name,
    phone: req.phone || "",
    birthday: req.birthday,
    email: req.email,
  };
  await api.post("/users/validate-profile/", data);
}

export async function validateLogin(req) {
  await api.post("/users/validate-login/", req);
}
