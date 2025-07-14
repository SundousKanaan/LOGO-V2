import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";

import { postTodoItem, deleteTodoItem, updateTodoItem } from "../services/api";

export function useTodoItemHandlers(refetchTodoLists) {
  const queryClient = useQueryClient();
  const [newListItemDetails, setNewListItemDetails] = useState(null);
  const [openItemPopup, setOpenItemPopup] = useState(null); // {case: create | edit | delete, title: column_title} | null

  // CREATE todo item mutation
  const { mutate: createTodoItem, isLoading: isCreatingItem } = useMutation({
    mutationFn: async (data) => {
      const response = await postTodoItem(data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return response;
    },

    onMutate: async (newItem) => {
      await queryClient.cancelQueries(["allTodoLists"]);
      const prevData = queryClient.getQueryData(["allTodoLists"]);

      const tempId = `temp-${Date.now()}`; // Temporary ID for optimistic update
      const updated = prevData.map((list) =>
        list.id === newItem.todo_list
          ? {
              ...list,
              items: [
                ...list.items,
                {
                  ...newItem,
                  id: tempId,
                  created_at: new Date().toISOString(),
                  last_modified: new Date().toISOString(),
                },
              ],
            }
          : list
      );
      queryClient.setQueryData(["allTodoLists"], updated);
      return {
        prevData,
        tempId,
      };
    },

    onSuccess: async (realItem, variables, context) => {
      queryClient.setQueryData(["allTodoLists"], (oldData) => {
        return oldData.map((list) =>
          list.id === realItem.todo_list
            ? {
                ...list,
                items: list.items.map((item) =>
                  item.id === context.tempId ? { ...realItem } : item
                ),
              }
            : list
        );
      });
      queryClient.invalidateQueries(["allTodoLists"]);
      await refetchTodoLists();
    },

    onError: (error, newItem, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(["allTodoLists"], context.prevData);
      }
    },

    onSettled: () => {
      setNewListItemDetails(null);
    },
  });

  // DELETE todo item mutation
  const { mutate: delete_todoItem, isLoading: isDeletingItem } = useMutation({
    mutationFn: async (id) => {
      const response = await deleteTodoItem(id);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return response;
    },

    onSuccess: async () => {
      queryClient.invalidateQueries(["allTodoLists"]);
      setOpenItemPopup(null);
    },

    onError: (err) => {
      console.error(
        "Error with Item deleting",
        err.response?.data || err.message
      );
    },
  });

  // EDIT todo item mutation
  const { mutate: update_todoItem, isLoading: isUpdatingItem } = useMutation({
    mutationFn: async ({ id, ...data }) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await updateTodoItem(id, data);
      return response;
    },

    onMutate: async (newItem) => {
      setOpenItemPopup(null);
      await queryClient.cancelQueries(["allTodoLists"]);
      const prevData = queryClient.getQueryData(["allTodoLists"]);
      const tempId = `temp-${newItem.id}`;

      const updated = prevData?.map((list) =>
        list.id === newItem.todo_list
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === newItem.id
                  ? {
                      ...item,
                      ...newItem,
                      id: tempId,
                      last_modified: new Date().toISOString(),
                    }
                  : item
              ),
            }
          : list
      );

      queryClient.setQueryData(["allTodoLists"], updated);

      return {
        prevData,
      };
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["allTodoLists"]);
    },

    onError: (err, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(["allTodoLists"], context.prevData);
      }
      console.error(
        "Error updating todo item:",
        err.response?.data || err.message
      );
    },

    onSettled: () => {
      setNewListItemDetails(null);
    },
  });

  // POPUP UTILS
  const openCreateItemPopup = useCallback((colTitle) => {
    setNewListItemDetails(null);
    setOpenItemPopup({ case: "create", title: colTitle });
  }, []);

  const handleNewTaskChange = useCallback((formData) => {
    setNewListItemDetails(formData);
  }, []);

  // Action handlers
  async function handleCreateListItem() {
    if (!newListItemDetails) return;
    setOpenItemPopup(null);
    createTodoItem(newListItemDetails);
  }

  async function handleDeleteListItem(taskId) {
    delete_todoItem(taskId);
  }

  async function handleEditListItem(newTaskDetails) {
    const data = {
      id: newTaskDetails.id,
      title: newTaskDetails.title,
      description: newTaskDetails.description,
      status: newTaskDetails.status,
      assignee: newTaskDetails.assignee,
      todo_list: newTaskDetails.todo_list.id,
    };

    update_todoItem(data);
  }

  return {
    newListItemDetails,
    setNewListItemDetails,
    openItemPopup,
    setOpenItemPopup,
    isCreatingItem,
    isDeletingItem,
    isUpdatingItem,
    openCreateItemPopup,
    handleCreateListItem,
    handleDeleteListItem,
    handleEditListItem,
    handleNewTaskChange,
  };
}
