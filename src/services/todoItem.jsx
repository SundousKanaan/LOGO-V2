import api from "./api";

export async function updateTodoItem(req) {
  try {
    await api.put(`todos/todo_items/${req.data.id}/`, req);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function postTodoItem(req) {
  console.log("Posting Todo Item:", req);

  try {
    const response = await api.post("todos/todo_items/", req);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function deleteTodoItem(id) {
  try {
    await api.delete(`todos/todo_items/${id}/`);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
