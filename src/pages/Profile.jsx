import { useEffect, useState, useCallback } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useListPermissions } from "../hooks/usePermissions";

import {
  useTodolistsArray,
  useListDetails,
  postTodoList,
  updateTodoList,
  deleteTodoList,
} from "../services/todoList";
import { deleteTodoItem, updateTodoItem } from "../services/todoItem";
import { useCreateTodoItem } from "../hooks/useCreateTodoItem";
import { putUser, deleteUser, validateProfile } from "../services/users";

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
  const createTodoItem = useCreateTodoItem(selectedList?.id);

  const {
    data: todoListsArray,
    // isLoading: isListsArrayLoading,
    refetch: refetchTodoLists,
    isFetched: isListsArrayFetched,
  } = useTodolistsArray(["id", "title", "owner"]);

  const {
    data: listDetails,
    isLoading: isListDetailsLoading,
    isFetched: isListDetailsFetched,
    refetch: refetchListDetails,
  } = useListDetails(selectedList?.id || null, {
    enabled: !!selectedList?.id, // only fetch if we have a valid ID
  });

  // =====================
  // Effects
  // =====================

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

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

    validateProfile(accountData).then((res) => {
      if (!res.success) {
        const errors = res.errors;
        if (errors.first_name || errors.last_name) {
          console.log("1 Profile validation errors:", errors);

          setErrorEditMessage({
            type: "name",
            message: errors.first_name?.[0] || errors.last_name?.[0],
          });
        } else if (errors.phone) {
          console.log("2 Profile validation errors:", errors);
          setErrorEditMessage({
            type: "phone",
            message: errors.phone[0],
          });
        }
      } else {
        setErrorEditMessage(null);
      }
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
    await postTodoList({ title: listTitle, owner: currentUser.id });
    queryClient.invalidateQueries("todolistsArray");

    const { data: updatedData } = await refetchTodoLists();
    const newList = updatedData.find(
      (item) =>
        item.title === listTitle && item.owner === currentUser.firebase_uid
    );
    setSelectedList(newList);
    setListTitle(listTitle);
    setOpenListPopup(null);
  }

  async function handleEditList() {
    const updatedListData = {
      id: selectedList.id,
      title: listTitle,
      owner: selectedList.owner,
      items: listDetails?.items.map((item) => item.id) || [],
    };
    await updateTodoList(updatedListData);
    setSelectedList((prev) => ({ ...prev, title: listTitle }));
    setListTitle(listTitle);
    setOpenListPopup(null);
  }

  async function handleDeleteList() {
    await deleteTodoList(selectedList.id);
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
  }

  // list items handlers
  async function handleCreateListItem() {
    if (!newListItemDetails) return;
    setOpenItemPopup(null);
    createTodoItem.mutate(newListItemDetails, {
      onSuccess: () => {
        setNewListItemDetails(null);
      },
    });
  }

  async function handleDeleteListItem(taskId) {
    await deleteTodoItem(taskId);
    setOpenItemPopup(null);
    await queryClient.invalidateQueries("todolistDetails");
    await refetchListDetails();
  }

  async function handleEditListItem(newTaskDetails) {
    const req = {
      data: {
        id: newTaskDetails.id,
        title: newTaskDetails.title,
        description: newTaskDetails.description,
        status: newTaskDetails.status,
        assignee: newTaskDetails.assignee,
        todo_list: newTaskDetails.todo_list,
      },
    };
    await updateTodoItem(req);
    await queryClient.invalidateQueries("todolistDetails");
    await refetchListDetails();
    setOpenItemPopup(null);
    setNewListItemDetails(null);
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
    const reqData = {
      firebase_uid: accountData.firebase_uid,
      id: accountData.id,
      first_name: accountData.first_name,
      last_name: accountData.last_name,
      email: accountData.email,
      phone: accountData.phone || "",
      birthday: accountData.birthday || "",
      is_active: true,
      user_type: accountData.user_type,
    };

    await putUser(reqData);
    queryClient.invalidateQueries(["allUsers"]);
    setOpenUserPopup(false);
    setAccountData(null);
    setErrorEditMessage(null);
  }

  async function handleDeleteUser() {
    if (!accountData) return;
    await deleteUser(accountData.id);
    await logout();
    setOpenUserPopup(false);
    setAccountData(null);
    setErrorEditMessage(null);
  }

  // ==== Validation ====
  // function isTaskDetailsValid(form) {
  //   return (
  //     form && form.title && form.title.trim() !== "" && form.assignee.length > 0
  //   );
  // }

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
      />
    </>
  );
}
