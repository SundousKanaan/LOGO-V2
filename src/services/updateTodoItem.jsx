import api from "./api";

export async function putTodoItem(req) {
  try {
    await api.put(`todos/todo_items/item/${req.data.id}/`, req);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
