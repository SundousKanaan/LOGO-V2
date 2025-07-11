import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";

import {
  postTodoItemAPI,
  deleteTodoItemAPI,
  updateTodoItemAPI,
} from "../services/api";

export function useTodoItemHandlers() {
  const queryClient = useQueryClient();
  const [newListItemDetails, setNewListItemDetails] = useState(null);
  const [openItemPopup, setOpenItemPopup] = useState(null); // {case: create | edit | delete, title: column_title} | null

  // CREATE todo item mutation
  const { mutate: createTodoItem, isLoading: isCreatingItem } = useMutation({
    mutationFn: async (data) => {
      const response = await postTodoItemAPI(data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return response;
    },

    onMutate: async (newItem) => {
      await queryClient.cancelQueries("todolistsArray");
      const prevData = queryClient.getQueryData("todolistsArray");

      const tempId = `temp-${Date.now()}`; // Temporary ID for optimistic update
      const updated = prevData?.map((list) =>
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
      await queryClient.setQueryData("todolistsArray", updated);

      return {
        prevData,
        tempId,
      };
    },

    // eslint-disable-next-line no-unused-vars
    onSuccess: async (realItem, variables, context) => {
      await queryClient.invalidateQueries("todolistsArray");
    },

    onError: (error, newItem, context) => {
      if (context?.prevData) {
        queryClient.setQueryData("todolistsArray", context.prevData);
      }
    },

    onSettled: () => {
      setNewListItemDetails(null);
    },
  });

  // DELETE todo item mutation
  const { mutate: deleteTodoItem, isLoading: isDeletingItem } = useMutation({
    mutationFn: async (id) => {
      const response = await deleteTodoItemAPI(id);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return response;
    },

    onSuccess: async () => {
      queryClient.invalidateQueries("todolistsArray");
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
  const { mutate: updateTodoItem, isLoading: isUpdatingItem } = useMutation({
    mutationFn: async ({ id, ...data }) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await updateTodoItemAPI(id, data);
      return response;
    },

    onMutate: async (newItem) => {
      setOpenItemPopup(null);
      await queryClient.cancelQueries("todolistsArray");
      const prevData = queryClient.getQueryData("todolistsArray");
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

      queryClient.setQueryData("todolistsArray", updated);

      return {
        prevData,
      };
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["todolistsArray"]);
    },

    onError: (err, context) => {
      if (context?.prevData) {
        queryClient.setQueryData("todolistsArray", context.prevData);
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
    deleteTodoItem(taskId);
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

    updateTodoItem(data);
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
