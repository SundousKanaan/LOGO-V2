import api from "./api";
import { useMutation, useQueryClient } from "react-query";
import { useGetAllUsers } from "./usersServices.jsx";

export const updateItem = async ({ id, data }) => {
  const res = await api.put(`todos/todo_items/${id}/`, data);
  return res.data;
};

export function useUpdateTodoItem() {
  async function updateTodoItem(req) {
    await api.put(`todos/todo_items/${req.id}/`, req);
  }

  return useMutation({
    mutationFn: updateTodoItem,
    onError: (err) => {
      console.error(
        "Error with Item updating",
        err.response?.data || err.message
      );
    },
  });
}

export function useCreateTodoItem(listId) {
  const queryClient = useQueryClient();
  const { data: allUsers } = useGetAllUsers();

  async function postTodoItem(req) {
    const response = await api.post("todos/todo_items/", req);
    return response.data;
  }

  return useMutation({
    mutationFn: postTodoItem,

    onMutate: async (newItem) => {
      await queryClient.cancelQueries(["todolistDetails", listId]);
      const previousListDetails = queryClient.getQueryData([
        "todolistDetails",
        listId,
      ]);

      const assigneeUsers =
        allUsers?.filter((user) => newItem.assignee.includes(user.id)) || [];

      // You can use assigneeData as needed, e.g., attach to the optimistic item if required
      const tempId = `temp-${Date.now()}`; // Temporary ID for optimistic update

      queryClient.setQueryData(["todolistDetails", listId], (oldData) => ({
        ...oldData,
        items: [
          ...(oldData?.items || []),
          {
            ...newItem,
            id: tempId,
            assignee: assigneeUsers,
            created_at: new Date().toISOString(),
            last_modified: new Date().toISOString(),
          },
        ],
      }));

      return {
        previousListDetails,
        tempId,
      };
    },

    onError: (error, newItem, context) => {
      if (context?.previousListDetails) {
        queryClient.setQueryData(
          ["todolistDetails", listId],
          context.previousListDetails
        );
      }
    },

    onSuccess: (realItem, _variables, context) => {
      const tempId = context?.tempId;

      if (!tempId) return;
      queryClient.setQueryData(["todolistDetails", listId], (oldData) => {
        if (!oldData) return oldData;

        const assigneeUsers =
          allUsers?.filter((user) => realItem.assignee.includes(user.id)) || [];

        realItem.assignee = assigneeUsers;

        return {
          ...oldData,
          items: oldData.items.map((item) =>
            item.id === tempId ? realItem : item
          ),
        };
      });
    },
  });
}

export function useDeleteTodoItem() {
  async function deleteTodoItem(itemId) {
    await api.delete(`todos/todo_items/${itemId}/`);
  }

  return useMutation({
    mutationFn: deleteTodoItem,
    onError: (err) => {
      console.error(
        "Error with Item deleting",
        err.response?.data || err.message
      );
    },
  });
}
