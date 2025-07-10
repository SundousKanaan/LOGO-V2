import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";
import {
  // useGetAllTodolistsAPI,
  postTodoListAPI,
  updateTodoListAPI,
  deleteTodoListAPI,
} from "../services/todoListServices";
import { useListPermissions } from "./usePermissions";

export function useTodoListHandlers(
  currentUser,
  selectedList,
  todoListsArray,
  isisListsArrayLoading,
  isListsArrayFetched,
  setSelectedList,
  setOpenListPopup,
  refetchTodoLists
) {
  const queryClient = useQueryClient();

  const [listTitle, setListTitle] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const { checkPermissions } = useListPermissions();

  // CREATE todo list mutation
  const { mutate: createTodoList, isLoading: isCreatingList } = useMutation({
    mutationFn: async (data) => {
      const respones = await postTodoListAPI(data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return respones;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries("todolistsArray");

      const { data: updatedData } = await refetchTodoLists();
      const newList = updatedData.find(
        (item) => item.title === listTitle && item.owner === currentUser.id
      );
      setSelectedList(newList);
      setListTitle(listTitle);
      setOpenListPopup(null);
    },
    onError: (err) => {
      console.error(
        "Error with creating new list",
        err.response?.data || err.message
      );
    },
  });

  // EDIT todo list mutation
  const { mutate: updateTodoList, isLoading: isUpdatingList } = useMutation({
    mutationFn: async (data) => {
      const response = await updateTodoListAPI(data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response;
    },
    onSuccess: async () => {
      await refetchTodoLists();
      setSelectedList((prev) => ({ ...prev, title: listTitle }));
      setListTitle(listTitle);
      setOpenListPopup(null);
    },
    onError: (err) => {
      console.error(
        "Error with creating new list",
        err.response?.data || err.message
      );
    },
  });

  // DELETE todo list mutation
  const { mutate: deleteTodoList, isLoading: isDeletingList } = useMutation({
    mutationFn: async (id) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const response = await deleteTodoListAPI(id);
      return response;
    },
    onSettled: () => {
      setOpenListPopup(null);
    },
    onSuccess: async () => {
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

  // USE EFFECTS
  // Initiële selectie
  useEffect(() => {
    if (
      !isisListsArrayLoading &&
      isListsArrayFetched &&
      todoListsArray?.length > 0 &&
      !selectedList
    ) {
      setSelectedList(todoListsArray[0]);
      setListTitle(todoListsArray[0].title);
    }
  }, [
    todoListsArray,
    selectedList,
    isisListsArrayLoading && isListsArrayFetched,
  ]);

  useEffect(() => {
    if (!selectedList) return;
    setIsEditable(checkPermissions(selectedList));
  }, [selectedList, checkPermissions]);

  // Action handlers
  async function handleChangeList(data) {
    const selected = todoListsArray.find((item) => item.id === data.value[0]);
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
    updateTodoList(updatedListData);
  }

  async function handleDeleteList() {
    deleteTodoList(selectedList.id);
  }

  return {
    listTitle,
    setListTitle,
    isEditable,
    // todoListsArray,
    // isisListsArrayLoading,
    // isListsArrayFetched,
    handleChangeList,
    handleCreateList,
    handleEditList,
    handleDeleteList,
    isCreatingList,
    isUpdatingList,
    isDeletingList,
  };
}
