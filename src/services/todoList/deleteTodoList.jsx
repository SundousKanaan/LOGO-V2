import api from "../api";

export async function deleteTodoList(id) {
  try {
    await api.delete(`todos/todo_lists/${id}/`);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
