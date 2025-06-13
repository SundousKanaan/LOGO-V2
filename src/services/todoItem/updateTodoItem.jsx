import api from "../api";

export async function updateTodoItem(req) {
  try {
    await api.put(`todos/todo_items/${req.data.id}/`, req);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
