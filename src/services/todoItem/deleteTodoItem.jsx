import api from "../api";

export async function deleteTodoItem(id) {
  try {
    await api.delete(`todos/todo_items/${id}/`);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
