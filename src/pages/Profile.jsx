import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAllTodoLists } from "../hooks/useAllTodoLists";
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

  // =====================
  // Hooks & data fetching
  // =====================

  const {
    isAuthenticated,
    currentUser,
    isLoading: isCurrentUserLoading,
    logout,
  } = useAuth();

  const {
    data: allTodoLists,
    refetch: refetchTodoLists,
    isLoading: isAllTodoListsLoading,
    isFetched: isAllTodoListsFetched,
  } = useAllTodoLists();

  const {
    listTitle,
    openListPopup,
    isEditable,
    isCreatingList,
    isUpdatingList,
    isDeletingList,
    setOpenListPopup,
    setListTitle,
    handleChangeList,
    handleCreateList,
    handleEditList,
    handleDeleteList,
  } = useTodoListHandlers(
    currentUser,
    selectedList,
    allTodoLists,
    isAllTodoListsLoading,
    setSelectedList,
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
  } = useTodoItemHandlers(refetchTodoLists);

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

  useEffect(() => {
    if (allTodoLists && selectedList)
      return setSelectedList(
        allTodoLists.find((list) => list.id === selectedList.id && list)
      );
  }, [allTodoLists]);

  return (
    <>
      <ProfileCard
        user={handledUser}
        isloading={isCurrentUserLoading}
        onEdit={() => setOpenUserPopup("edit")}
        onDelete={() => setOpenUserPopup("delete")}
        isProcessing={isUpdatingUser || isDeletingUser}
      />

      <ListsActions
        allTodoLists={allTodoLists}
        isLoading={!isAllTodoListsFetched}
        isEditable={isEditable}
        isAuthenticated={isAuthenticated}
        selectedList={selectedList}
        onListchange={handleChangeList}
        onEdit={() => setOpenListPopup("edit")}
        onDelete={() => setOpenListPopup("delete")}
        onCreate={() => setOpenListPopup("create")}
      />

      <TodoBoard
        listDetails={selectedList}
        isLoading={isAllTodoListsLoading}
        isFetched={isAllTodoListsFetched}
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
