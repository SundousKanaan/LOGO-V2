import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { useQueryClient } from "react-query";
import { postTodoList, updateTodoList, deleteTodoList } from "../services/api";
import { usePermissions } from "./usePermissions";
import { validateTodoListDataLocally } from "./useLocalValidates";

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
  const [errorMessage, setErrorMessage] = useState(null);

  // USE EFFECTS

  // Initiële selectie
  useEffect(() => {
    if (!isAllTodoListsLoading && allTodoLists?.length > 0 && !selectedList) {
      setSelectedList(allTodoLists[0]);
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
      setSelectedList(realList);
      setListTitle("");
      setOpenListPopup(null);
    },

    onError: (err, _newList, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["allTodoLists"], context.prev);
      }
      setErrorMessage(err.response.data);
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
      setListTitle("");
      setOpenListPopup(null);
    },

    onError: (err) => {
      setErrorMessage(err.response.data);
    },
  });

  // DELETE todo list mutation
  const { mutate: delete_todoList, isLoading: isDeletingList } = useMutation({
    mutationFn: async (id) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const response = await deleteTodoList(id);
      return response;
    },
    onSuccess: async () => {
      // queryClient.invalidateQueries(["allTodoLists"]);

      const { data: updatedData } = await refetchTodoLists();

      if (updatedData?.length > 0) {
        setSelectedList(updatedData[0]);
      } else {
        setSelectedList(null);
        setIsEditable(false);
      }
      setListTitle("");
      setOpenListPopup(null);
    },

    onError: (err) => {
      setErrorMessage(err.response.data.detail);
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
    setErrorMessage(null);
    const localErrors = validateTodoListDataLocally(listTitle);
    if (localErrors) {
      setErrorMessage(localErrors);
      return;
    }
    createTodoList({ title: listTitle, owner: currentUser.id });
  }

  async function handleEditList() {
    setErrorMessage(null);
    const localErrors = validateTodoListDataLocally(listTitle);
    if (localErrors) {
      setErrorMessage(localErrors);
      return;
    }

    const updatedListData = {
      id: selectedList.id,
      title: listTitle,
      owner: selectedList.owner,
      items: selectedList?.items.map((item) => item.id) || [],
    };
    update_todoList(updatedListData);
  }

  async function handleDeleteList() {
    setErrorMessage(null);
    delete_todoList(selectedList.id);
  }

  return {
    setListTitle,
    isEditable,
    errorMessage,
    openListPopup,
    setOpenListPopup,
    setErrorMessage,

    handleChangeList,
    handleCreateList,
    handleEditList,
    handleDeleteList,

    isCreatingList,
    isUpdatingList,
    isDeletingList,
  };
}
