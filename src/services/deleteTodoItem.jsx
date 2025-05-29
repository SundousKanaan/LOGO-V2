import api from "./api";

export async function deleteTodoItem(req) {
  try {
    await api.delete(`todos/todo_items/item/${req.id}/`, req);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
