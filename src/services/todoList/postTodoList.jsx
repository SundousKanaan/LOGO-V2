import api from "../api";

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
