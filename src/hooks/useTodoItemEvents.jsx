import { useMutation, useQueryClient } from "react-query";
import { postTodoItem } from "../services/todoItem";

export function useCreateTodoItem(listId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postTodoItem,

    onMutate: async (newItem) => {
      await queryClient.cancelQueries(["todolistDetails", listId]);

      const previousListDetails = queryClient.getQueryData([
        "todolistDetails",
        listId,
      ]);

      const tempId = `temp-${Date.now()}`; // Temporary ID for optimistic update
      queryClient.setQueryData(["todolistDetails", listId], (oldData) => ({
        ...oldData,
        items: [
          ...(oldData?.items || []),
          {
            ...newItem,
            id: tempId,
            // created_at: new Date().toISOString(),
            // last_modified: new Date().toISOString(),
          },
        ],
      }));

      return {
        previousListDetails,
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

    // eslint-disable-next-line no-unused-vars
    onSuccess: (realItem, tempItem, context) => {
      const tempId = tempItem.id;
      queryClient.setQueriesData(["todolistDetails", listId], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          items: oldData.items.map((item) =>
            item.id === tempId ? realItem : item
          ),
        };
      });

      queryClient.invalidateQueries(["todolistDetails", listId]);
    },
  });
}
