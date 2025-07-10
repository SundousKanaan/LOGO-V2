import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import {
  useUpdateUser,
  useDeleteUser,
  useValidateProfile,
} from "../services/usersServices";

import { useGetAllTodolistsAPI } from "../services/todoListServices";

import { useTodoItemHandlers } from "../hooks/useTodoItemHandlers";
import { useTodoListHandlers } from "../hooks/useTodoListHandlers";

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

  const [openListPopup, setOpenListPopup] = useState(null); // create | edit | delete | null
  const [openUserPopup, setOpenUserPopup] = useState(null); // edit | delete | null

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

  const {
    data: todoListsArray,
    refetch: refetchTodoLists,
    isLoading: isListsArrayLoading,
    isFetched: isListsArrayFetched,
  } = useGetAllTodolistsAPI();

  const {
    listTitle,
    setListTitle,
    isEditable,
    handleChangeList,
    handleCreateList,
    handleEditList,
    handleDeleteList,
    isCreatingList,
    isUpdatingList,
    isDeletingList,
  } = useTodoListHandlers(
    currentUser,
    selectedList,
    todoListsArray,
    isListsArrayLoading,
    isListsArrayFetched,
    setSelectedList,
    setOpenListPopup,
    refetchTodoLists
  );

  const {
    newListItemDetails,
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
  } = useTodoItemHandlers();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  // Input change for list title
  function handleInputChange(e) {
    setListTitle(e.target.value);
  }

  //  ==== Popups Actions ====
  // user handlers
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
        isLoading={isListsArrayLoading}
        isFetched={isListsArrayFetched}
        listDetails={selectedList}
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
        list={selectedList}
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
