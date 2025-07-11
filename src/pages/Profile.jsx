import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useFetchAllTodolists } from "../hooks/useFetchAllTodolists";
import { useTodoItemHandlers } from "../hooks/useTodoItemHandlers";
import { useTodoListHandlers } from "../hooks/useTodoListHandlers";
import { useUserHandlers } from "../hooks/useUserHandlers";

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
  } = useFetchAllTodolists();

  const {
    listTitle,
    isEditable,
    isCreatingList,
    isUpdatingList,
    isDeletingList,
    setListTitle,
    handleChangeList,
    handleCreateList,
    handleEditList,
    handleDeleteList,
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
    isCreatingItem,
    isDeletingItem,
    isUpdatingItem,
    openCreateItemPopup,
    setOpenItemPopup,
    handleCreateListItem,
    handleDeleteListItem,
    handleEditListItem,
    handleNewTaskChange,
  } = useTodoItemHandlers();

  const {
    handledUser,
    UserErrorMessage,
    openUserPopup,
    isDeletingUser,
    isUpdatingUser,
    setUserErrorMessage,
    setHandledUser,
    setOpenUserPopup,
    handleDeleteUser,
    handleUpdateUser,
    handleUserDataChange,
  } = useUserHandlers({
    initialUser: currentUser,
    logout,
  });

  const navigate = useNavigate();

  // =====================
  // Effects
  // =====================

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <>
      <ProfileCard
        user={handledUser}
        isloading={!isCurrentUserFetched}
        onEdit={() => setOpenUserPopup("edit")}
        onDelete={() => setOpenUserPopup("delete")}
        isProcessing={isUpdatingUser || isDeletingUser}
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
        handleInputChange={(e) => setListTitle(e.target.value)}
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
        user={handledUser || currentUser}
        errorEditMessage={UserErrorMessage}
        handleUpdateUser={handleUpdateUser}
        handleDeleteUser={handleDeleteUser}
        setOpenUserPopup={setOpenUserPopup}
        setAccountData={setHandledUser}
        setErrorEditMessage={setUserErrorMessage}
        handleUserDataChange={handleUserDataChange}
        isProcessing={
          openUserPopup === "edit" ? isUpdatingUser : isDeletingUser
        }
      />
    </>
  );
}
