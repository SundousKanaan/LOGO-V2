import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";
import { postTodoList, updateTodoList, deleteTodoList } from "../services/api";
import { usePermissions } from "./usePermissions";

export function useTodoListHandlers(
  currentUser,
  selectedList,
  allTodoLists,
  isAllTodoListsLoading,
  setSelectedList,
  refetchTodoLists
) {
  const queryClient = useQueryClient();

  const [listTitle, setListTitle] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const { checkListPermissions } = usePermissions();
  const [openListPopup, setOpenListPopup] = useState(null); // create | edit | delete | null

  // USE EFFECTS

  // Initiële selectie
  useEffect(() => {
    if (!isAllTodoListsLoading && allTodoLists?.length > 0 && !selectedList) {
      setSelectedList(allTodoLists[0]);
      setListTitle(allTodoLists[0].title);
    }
  }, [allTodoLists, selectedList, isAllTodoListsLoading]);

  useEffect(() => {
    setIsEditable(checkListPermissions(selectedList));
  }, [selectedList]);

  // CREATE todo list mutation
  const { mutate: createTodoList, isLoading: isCreatingList } = useMutation({
    mutationFn: async (data) => {
      const respones = await postTodoList(data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return respones;
    },
    onMutate: (data) => {
      queryClient.cancelQueries(["allTodoLists"]);
      const prevList = queryClient.getQueriesData(["allTodoLists"]);
      const tempList = {
        id: `temp-${Date.now()}`,
        title: data.title,
        owner: data.owner,
        items: [],
        isTemp: true,
      };
      queryClient.setQueryData(["allTodoLists"], (old = []) => [
        ...old,
        tempList,
      ]);

      return {
        prevList,
        tempId: tempList.id,
      };
    },

    onSuccess: async (realList, _variables, context) => {
      queryClient.setQueriesData([
        "allTodoLists",
        (old = []) =>
          old.map((list) => (list.id === context.tempId ? realList : list)),
      ]);
      queryClient.invalidateQueries(["allTodoLists"]);
    },

    onError: (err, _newList, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["allTodoLists"], context.prev);
      }
      console.error(
        "Error with creating new list",
        err.response?.data || err.message
      );
    },

    onSettled: (realList) => {
      setSelectedList(realList);
      setListTitle(listTitle);
      setOpenListPopup(null);
    },
  });

  // EDIT todo list mutation
  const { mutate: update_todoList, isLoading: isUpdatingList } = useMutation({
    mutationFn: async (data) => {
      const response = await updateTodoList(data);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return response;
    },
    onMutate: (data) => {
      queryClient.cancelQueries(["allTodoLists"]);
      const prevList = queryClient.getQueriesData(["allTodoLists"]);

      const tempId = `temp-${data.id}`;

      // Find the target list to update
      const tempList = {
        ...data,
        id: tempId,
      };
      queryClient.setQueryData(["allTodoLists"], (old = []) =>
        old.map((list) => (list.id === data.id ? tempList : list))
      );

      return {
        prevList,
        tempId: tempId,
      };
    },

    onSuccess: async (realList, _variables, context) => {
      queryClient.setQueryData(["allTodoLists"], (old = []) =>
        old.map((list) => (list.id === context.tempId ? realList : list))
      );
      setSelectedList(realList);
      queryClient.invalidateQueries(["allTodoLists"]);
    },
    onError: (err) => {
      console.error(
        "Error with creating new list",
        err.response?.data || err.message
      );
    },

    onSettled: () => {
      setListTitle(listTitle);
      setOpenListPopup(null);
    },
  });

  // DELETE todo list mutation
  const { mutate: delete_todoList, isLoading: isDeletingList } = useMutation({
    mutationFn: async (id) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const response = await deleteTodoList(id);
      return response;
    },
    onSettled: () => {
      setOpenListPopup(null);
    },
    onSuccess: async () => {
      // queryClient.invalidateQueries(["allTodoLists"]);

      const { data: updatedData } = await refetchTodoLists();

      if (updatedData?.length > 0) {
        setSelectedList(updatedData[0]);
        setListTitle(updatedData[0].title);
      } else {
        setSelectedList(null);
        setListTitle("");
        setIsEditable(false);
      }
    },
    onError: (err) => {
      console.error(
        "Error with creating new list",
        err.response?.data || err.message
      );
    },
  });

  // Action handlers
  async function handleChangeList(data) {
    const selected = allTodoLists.find((item) => item.id === data.value[0]);
    setSelectedList(selected);
    setListTitle(selected.title);
    queryClient.invalidateQueries("todolistDetails");
  }

  async function handleCreateList() {
    createTodoList({ title: listTitle, owner: currentUser.id });
  }

  async function handleEditList() {
    const updatedListData = {
      id: selectedList.id,
      title: listTitle,
      owner: selectedList.owner,
      items: selectedList?.items.map((item) => item.id) || [],
    };
    update_todoList(updatedListData);
  }

  async function handleDeleteList() {
    delete_todoList(selectedList.id);
  }

  return {
    listTitle,
    setListTitle,
    isEditable,
    openListPopup,
    setOpenListPopup,
    handleChangeList,
    handleCreateList,
    handleEditList,
    handleDeleteList,
    isCreatingList,
    isUpdatingList,
    isDeletingList,
  };
}
