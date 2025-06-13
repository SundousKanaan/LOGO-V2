import api from "../api";

export async function postTodoItem(data) {
  try {
    await api.post("todos/todo_items/", data);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
