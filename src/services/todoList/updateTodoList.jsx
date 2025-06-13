import api from "../api";

export async function updateTodoList(req) {
  try {
    await api.put(`todos/todo_lists/${req.id}/`, req);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
