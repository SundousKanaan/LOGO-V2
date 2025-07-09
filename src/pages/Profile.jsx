import { useEffect, useState, useCallback } from "react";
import { useQueryClient, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useListPermissions } from "../hooks/usePermissions";

import {
  useGetAllTodolistsAPI,
  useListDetailsAPI,
  useUpdateTodoList,
  useDeleteTodoList,
  useCreateTodoList,
} from "../services/todoListServices";

import {
  deleteTodoItemAPI,
  updateTodoItemAPI,
  postTodoItemAPI,
} from "../services/api";

import {
  useUpdateUser,
  useDeleteUser,
  useValidateProfile,
} from "../services/usersServices";

import {
  ListPopup,
  ListItemPopup,
  UserPopup,
} from "../components/ProfilePopups";
import ProfileCard from "../components/ProfileCard";
import ListsActions from "../components/ListsActions";
import TodoBoard from "../components/Todo-Board";

export default function Profile() {
  // =====================
  // States
  // =====================

  const [selectedList, setSelectedList] = useState(null);
  const [listTitle, setListTitle] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  const [openListPopup, setOpenListPopup] = useState(null); // create | edit | delete | null
  const [openItemPopup, setOpenItemPopup] = useState(null); // {case: create | edit | delete, title: column_title} | null
  const [openUserPopup, setOpenUserPopup] = useState(null); // edit | delete | null
  const [newListItemDetails, setNewListItemDetails] = useState(null);

  const [errorEditMessage, setErrorEditMessage] = useState(null);
  const [accountData, setAccountData] = useState(null);

  // =====================
  // Hooks & data fetching
  // =====================

  const {
    isAuthenticated,
    currentUser,
    isFetched: isCurrentUserFetched,
    logout,
  } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { checkPermissions } = useListPermissions();

  const {
    data: todoListsArray,
    refetch: refetchTodoLists,
    isFetched: isListsArrayFetched,
  } = useGetAllTodolistsAPI(["id", "title", "owner"]);

  const {
    data: listDetails,
    isLoading: isListDetailsLoading,
    isFetched: isListDetailsFetched,
    refetch: refetchListDetails,
  } = useListDetailsAPI(selectedList?.id || null, {
    enabled: !!selectedList?.id, // only fetch if we have a valid ID
  });

  const { mutate: createTodoList, isLoading: isCreatingList } =
    useCreateTodoList();
  const { mutate: updateTodoList, isLoading: isUpdatingList } =
    useUpdateTodoList();
  const { mutate: deleteTodoList, isLoading: isDeletingList } =
    useDeleteTodoList();

  const { mutate: updateUser, isLoading: isUpdatingUser } = useUpdateUser();
  const { mutate: deleteUser, isLoading: isDeletingUser } = useDeleteUser();
  const validateProfile = useValidateProfile();

  // =====================
  // Effects
  // =====================

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

  // set account data from current user
  useEffect(() => {
    if (isCurrentUserFetched) {
      setAccountData(currentUser);
    }
  }, [isCurrentUserFetched, currentUser]);

  // Initiële selectie
  useEffect(() => {
    if (isListsArrayFetched && todoListsArray?.length > 0 && !selectedList) {
      setSelectedList(todoListsArray[0]);
      setListTitle(todoListsArray[0].title);
    }
  }, [todoListsArray, selectedList, isListsArrayFetched]);

  // Check permissions and set editable state
  useEffect(() => {
    if (!selectedList || todoListsArray?.length === 0) return;
    const found = todoListsArray.find((list) => list.id === selectedList.id);
    if (!found) return;

    const canBeEdit = checkPermissions(selectedList);

    setIsEditable(canBeEdit);

    const fetchListData = async () => {
      await refetchListDetails();
    };
    fetchListData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedList, todoListsArray]);

  useEffect(() => {
    if (!accountData) return;
    validateProfile.mutate(accountData, {
      onSuccess: () => {
        setErrorEditMessage(null);
      },
      onError: (err) => {
        const error = err.response.data.errors;
        if (error.first_name || error.last_name) {
          setErrorEditMessage({
            type: error.first_name?.[0] ? "first_name" : "last_name",
            message: error.first_name?.[0] || error.last_name?.[0],
          });
        } else if (error.phone) {
          setErrorEditMessage({
            type: "phone",
            message: error.phone[0],
          });
        } else if (error.birthday) {
          setErrorEditMessage({
            type: "birthday",
            message: error.birthday[0],
          });
        }
      },
    });
  }, [accountData]);

  // =====================
  // Handlers
  // =====================

  // list selection change
  async function handleChangeList(data) {
    const selected = todoListsArray.find((item) => item.id === data.value[0]);
    setSelectedList(selected);
    setListTitle(selected.title);
    queryClient.invalidateQueries("todolistDetails");
  }

  // Input change for list title
  function handleInputChange(e) {
    setListTitle(e.target.value);
  }

  function openCreateItemPopup(colTitle) {
    setNewListItemDetails(null);
    setOpenItemPopup({ case: "create", title: colTitle });
  }

  const handleNewTaskChange = useCallback((formData) => {
    setNewListItemDetails(formData);
  }, []);

  //  ==== Popups Actions ====
  // list handlers

  async function handleCreateList() {
    createTodoList(
      { title: listTitle, owner: currentUser.id },
      {
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
      }
    );
  }

  async function handleEditList() {
    const updatedListData = {
      id: selectedList.id,
      title: listTitle,
      owner: selectedList.owner,
      items: listDetails?.items.map((item) => item.id) || [],
    };
    updateTodoList(updatedListData, {
      onSuccess: () => {
        setSelectedList((prev) => ({ ...prev, title: listTitle }));
        setListTitle(listTitle);
        setOpenListPopup(null);
      },
    });
  }

  async function handleDeleteList() {
    deleteTodoList(selectedList.id, {
      onSuccess: async () => {
        queryClient.removeQueries(["todolistDetails", selectedList.id]);
        const { data: updatedData } = await refetchTodoLists();

        if (updatedData?.length > 0) {
          setSelectedList(updatedData[0]);
          setListTitle(updatedData[0].title);
        } else {
          setSelectedList(null);
          setListTitle("");
          setIsEditable(false);
        }

        setOpenListPopup(null);
      },
    });
  }

  // list items handlers
  const { mutate: createTodoItem, isLoading: isCreatingItem } = useMutation({
    // const { data: allUsers } = useGetAllUsers();

    mutationFn: async (data) => {
      const response = await postTodoItemAPI(data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return response;
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries(["todolistDetails", newItem.todo_list]);
      const previousListDetails = queryClient.getQueryData([
        "todolistDetails",
        newItem.todo_list,
      ]);

      // const assigneeUsers =
      //   allUsers?.filter((user) => newItem.assignee.includes(user.id)) || [];

      // You can use assigneeData as needed, e.g., attach to the optimistic item if required
      const tempId = `temp-${Date.now()}`; // Temporary ID for optimistic update

      queryClient.setQueryData(
        ["todolistDetails", newItem.todo_list],
        (oldData) => ({
          ...oldData,
          items: [
            ...(oldData?.items || []),
            {
              ...newItem,
              id: tempId,
              // assignee: assigneeUsers,
              created_at: new Date().toISOString(),
              last_modified: new Date().toISOString(),
            },
          ],
        })
      );

      return {
        previousListDetails,
        tempId,
      };
    },

    onSuccess: (realItem, _variables, context) => {
      const tempId = context?.tempId;

      if (!tempId) return;
      queryClient.setQueryData(
        ["todolistDetails", realItem.todo_list],
        (oldData) => {
          if (!oldData) return oldData;

          // const assigneeUsers =
          //   allUsers?.filter((user) => realItem.assignee.includes(user.id)) ||
          //   [];

          // realItem.assignee = assigneeUsers;

          return {
            ...oldData,
            items: oldData.items.map((item) =>
              item.id === tempId ? realItem : item
            ),
          };
        }
      );
    },

    onSettled: () => {
      setNewListItemDetails(null);
    },

    onError: (error, newItem, context) => {
      if (context?.previousListDetails) {
        queryClient.setQueryData(
          ["todolistDetails", newItem.todo_list],
          context.previousListDetails
        );
      }
    },
  });

  async function handleCreateListItem() {
    if (!newListItemDetails) return;
    setOpenItemPopup(null);
    createTodoItem(newListItemDetails);
  }

  const { mutate: deleteTodoItem, isLoading: isDeletingItem } = useMutation({
    mutationFn: async (id) => {
      const response = await deleteTodoItemAPI(id);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return response;
    },

    onSuccess: async () => {
      await refetchListDetails();
      // queryClient.invalidateQueries("todolistDetails");
      setOpenItemPopup(null);
    },

    onError: (err) => {
      console.error(
        "Error with Item deleting",
        err.response?.data || err.message
      );
    },
  });

  async function handleDeleteListItem(taskId) {
    deleteTodoItem(taskId);
  }

  const { mutate: updateTodoItem, isLoading: isUpdatingItem } = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await updateTodoItemAPI(id, data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return response;
    },

    onMutate: async (data) => {
      setOpenItemPopup(null);
      await queryClient.cancelQueries(["todolistDetails", data.todo_list]);
      const previousListDetails = queryClient.getQueryData([
        "todolistDetails",
        data.todo_list,
      ]);
      const tempId = `temp-${data.id}`;
      queryClient.setQueryData(
        ["todolistDetails", data.todo_list],
        (oldData) => ({
          ...oldData,
          items: (oldData?.items || []).map((item) =>
            item.id === data.id
              ? {
                  ...data,
                  id: tempId,
                  assignee: item.assignee,
                  last_modified: new Date().toISOString(),
                }
              : item
          ),
        })
      );

      return {
        previousListDetails,
      };
    },

    onSuccess: async () => {
      await refetchListDetails();
      queryClient.invalidateQueries("todolistDetails");
      setNewListItemDetails(null);
    },
    onError: (err) => {
      console.error(
        "Error updating todo item:",
        err.response?.data || err.message
      );
    },
  });

  async function handleEditListItem(newTaskDetails) {
    const data = {
      id: newTaskDetails.id,
      title: newTaskDetails.title,
      description: newTaskDetails.description,
      status: newTaskDetails.status,
      assignee: newTaskDetails.assignee,
      todo_list: newTaskDetails.todo_list,
    };

    updateTodoItem(data);
  }

  // user
  const handleUserDataChange = (e) => {
    const { name, value } = e.target;

    if (name === "firstName") {
      setAccountData((prevData) => ({
        ...prevData,
        first_name: value.trim(),
      }));
    } else if (name === "lastName") {
      setAccountData((prevData) => ({
        ...prevData,
        last_name: value.trim(),
      }));
    } else if (name === "phone") {
      setAccountData((prevData) => ({
        ...prevData,
        phone: value.trim(),
      }));
    } else if (name === "birthday") {
      setAccountData((prevData) => ({
        ...prevData,
        birthday: value.trim(),
      }));
    }
  };

  async function handleUpdateUser() {
    if (!accountData) return;
    const data = {
      id: accountData.id,
      first_name: accountData.first_name,
      last_name: accountData.last_name,
      email: accountData.email,
      phone: accountData.phone || "",
      birthday: accountData.birthday || "",
      is_active: true,
      user_type: accountData.user_type,
    };

    updateUser(data, {
      onSuccess: () => {
        queryClient.invalidateQueries(["allUsers"]);
        setAccountData(data);
        setOpenUserPopup(false);
        setErrorEditMessage(null);
      },
    });
  }

  async function handleDeleteUser() {
    if (!accountData) return;

    deleteUser(accountData.id, {
      onSuccess: async () => {
        await logout();
        setOpenUserPopup(false);
        setAccountData(null);
        setErrorEditMessage(null);
      },
    });
  }

  return (
    <>
      <ProfileCard
        user={currentUser}
        isloading={!isCurrentUserFetched}
        onEdit={() => setOpenUserPopup("edit")}
        onDelete={() => setOpenUserPopup("delete")}
      />

      <ListsActions
        todoListsArray={todoListsArray}
        isLoading={!isListsArrayFetched}
        isEditable={isEditable}
        isAuthenticated={isAuthenticated}
        selectedList={selectedList}
        onListchange={handleChangeList}
        onEdit={() => setOpenListPopup("edit")}
        onDelete={() => setOpenListPopup("delete")}
        onCreate={() => setOpenListPopup("create")}
      />

      <TodoBoard
        isLoading={isListDetailsLoading}
        isFetched={isListDetailsFetched}
        listDetails={listDetails}
        isEditable={isEditable}
        handleEditListItem={handleEditListItem}
        openCreateItemPopup={openCreateItemPopup}
        setOpenItemPopup={setOpenItemPopup}
      />

      {/* popups */}
      <ListPopup
        user={currentUser}
        openListPopup={openListPopup}
        selectedList={selectedList}
        listTitle={listTitle}
        handleInputChange={handleInputChange}
        handleCreateList={handleCreateList}
        handleEditList={handleEditList}
        handleDeleteList={handleDeleteList}
        setOpenListPopup={setOpenListPopup}
        isProcessing={
          openListPopup &&
          (openListPopup === "create"
            ? isCreatingList
            : openListPopup === "delete"
            ? isDeletingList
            : isUpdatingList)
        }
      />
      <ListItemPopup
        list={listDetails}
        openItemPopup={openItemPopup}
        newListItemDetails={newListItemDetails}
        handleCreateListItem={handleCreateListItem}
        handleEditListItem={handleEditListItem}
        handleDeleteListItem={handleDeleteListItem}
        setOpenItemPopup={setOpenItemPopup}
        handleNewTaskChange={handleNewTaskChange}
        isProcessing={
          openItemPopup?.case === "create"
            ? isCreatingItem
            : openItemPopup?.case === "delete"
            ? isDeletingItem
            : isUpdatingItem
        }
      />

      <UserPopup
        openUserPopup={openUserPopup}
        user={accountData || currentUser}
        errorEditMessage={errorEditMessage}
        handleUpdateUser={handleUpdateUser}
        handleDeleteUser={handleDeleteUser}
        setOpenUserPopup={setOpenUserPopup}
        setAccountData={setAccountData}
        setErrorEditMessage={setErrorEditMessage}
        handleUserDataChange={handleUserDataChange}
        isProcessing={
          openUserPopup === "edite" ? isUpdatingUser : isDeletingUser
        }
      />
    </>
  );
}
