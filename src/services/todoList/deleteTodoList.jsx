import api from "../api";

export async function deleteTodoList(req) {
  try {
    await api.delete(`todos/todo_lists/${req.id}/`, req);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
