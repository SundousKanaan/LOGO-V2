import { useEffect, useState } from "react";
import {
  Select,
  Flex,
  Spacer,
  createListCollection,
  HStack,
  Text,
  Box,
} from "@chakra-ui/react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { convertPx } from "../hooks/useConvertPx";
import { useTodolists } from "../services/todoList/getTodolists";
import { postTodoList } from "../services/todoList/postTodoList";
import { updateTodoList } from "../services/todoList/updateTodoList";
import { deleteTodoList } from "../services/todoList/deleteTodoList";
import { useListPermissions } from "../hooks/usePermissions";

import TodoList from "../components/TodoList";
import Dropdown from "../components/mini-components/Dropdown";
import ButtonItem from "../components/mini-components/ButtonItem";
import Popup from "../components/mini-components/Popup";
import AddNewTodoList from "../components/forms-components/AddNewTodoList";
import EditeTodoList from "../components/forms-components/EditeTodoList";

export default function Profile() {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: todoList, isLoading, isSuccess } = useTodolists();
  const [listDropdownValues, setListDropdownValues] = useState();
  const [showedList, setShowedList] = useState();
  const [openPopup, setOpenPopup] = useState(null);
  const [newListTitle, setNewListTitle] = useState("");
  const [editable, setEditable] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Prepare dropdown values and set default list
  useEffect(() => {
    if (!isSuccess || !todoList?.length) return;

    const dropdownCollection = createListCollection({
      items: todoList.map((item) => ({
        label: item.title,
        value: item.id,
      })),
    });
    setListDropdownValues(dropdownCollection);

    // Set the default list from localStorage or the first list
    const savedListName = localStorage.getItem("selectedList");
    if (!savedListName) {
      const defaultList = todoList[0];
      localStorage.setItem("selectedList", defaultList.title);
      setShowedList({
        title: defaultList?.title,
        id: defaultList?.id,
        owner: defaultList?.owner.firebase_uid,
      });
    } else {
      const savedList = todoList.find((item) => item.title === savedListName);
      setShowedList({
        title: savedList?.title,
        id: savedList?.id,
        owner: savedList?.owner.firebase_uid,
      });
    }
  }, [todoList, isSuccess]);

  const editePermission = useListPermissions(showedList);

  useEffect(() => {
    setEditable(editePermission);
  }, [editePermission]);

  function renderListContent() {
    if (!todoList || todoList.length === 0) {
      return <Text color="secondaryColor">No lists available.</Text>;
    }

    return todoList.map((list, i) => (
      <TodoList
        key={i}
        listData={list}
        display={list.id === showedList?.id ? "flex" : "none"}
        isEditable={editable}
      />
    ));
  }

  function handleChangeList(data) {
    const selectedList = todoList.find((item) => item.id === data.value[0]);
    localStorage.setItem("selectedList", selectedList.title);
    setShowedList({
      title: selectedList.title,
      id: selectedList.id,
      owner: selectedList.owner.firebase_uid,
    });
  }

  function handleInputChange(e) {
    setNewListTitle(e.target.value);
  }

  function renderDropdownContent() {
    if (
      !listDropdownValues ||
      !Array.isArray(listDropdownValues.items) ||
      listDropdownValues.items.length === 0
    ) {
      return (
        <Dropdown
          disabled
          collection={null}
          withIndicator
          width={{ base: "100%", lg: convertPx(400) }}
          bg="white"
          color="secondaryColor"
          height={convertPx(40)}
          borderRadius={convertPx(4)}
          buttonProps={{
            height: "100%",
            border: "none",
          }}
        ></Dropdown>
      );
    }

    return (
      <Dropdown
        collection={listDropdownValues}
        defaultValue={showedList?.id ?? listDropdownValues.items[0].value} // TODO: fix the default value!
        handleChange={handleChangeList}
        withIndicator
        width={{ base: "100%", lg: convertPx(400) }}
        bg="white"
        color="secondaryColor"
        height={convertPx(40)}
        borderRadius={convertPx(4)}
        buttonProps={{
          height: "100%",
          border: "none",
        }}
      >
        {listDropdownValues.items.map((list) => (
          <Select.Item
            item={list}
            key={list.value}
            flex={"none"}
            h={convertPx(60)}
            cursor={"pointer"}
            borderBottom={`${convertPx(
              3
            )} solid var(--chakra-colors-theme-color)`}
          >
            <Select.ItemText>{list.label}</Select.ItemText>
          </Select.Item>
        ))}
      </Dropdown>
    );
  }

  // popup functions
  async function handlePopupAction() {
    if (openPopup === "create") return await handleCreateList();
    if (openPopup === "delete") return await handleDeleteList();
    if (openPopup === "edit") return await handleEditList();
  }

  async function handleCreateList() {
    await postTodoList({ title: newListTitle, owner: currentUser.uid });
    queryClient.invalidateQueries("dbTodolists");
    const list = todoList.find((item) => item.id === showedList.id);
    localStorage.setItem("selectedList", newListTitle);

    setShowedList({
      title: list.title,
      id: list.id,
      owner: list.owner.firebase_uid,
    });
    setOpenPopup(null);
  }

  async function handleEditList() {
    const updatedListData = {
      id: showedList.id,
      title: newListTitle,
      owner: showedList.owner,
    };
    await updateTodoList(updatedListData);
    localStorage.setItem("selectedList", newListTitle);

    setShowedList(updatedListData);
    queryClient.invalidateQueries("dbTodolists");
    setOpenPopup(null);
  }

  async function handleDeleteList() {
    await deleteTodoList({ id: showedList.id });
    localStorage.removeItem("selectedList");
    queryClient.invalidateQueries("dbTodolists");
    setOpenPopup(null);
  }

  function renderPopupContent() {
    switch (openPopup) {
      case "create":
        return (
          <Popup
            isOpen={openPopup.length > 0}
            title={"Create new list"}
            onClose={() => setOpenPopup(null)}
            onSave={handlePopupAction}
            ActionButtonText={"create"}
            disableSaveButton={newListTitle === ""}
          >
            <AddNewTodoList
              user={currentUser}
              handleInputChange={handleInputChange}
            />
          </Popup>
        );

      case "edit":
        return (
          <Popup
            isOpen={openPopup.length > 0}
            title={"Edit list"}
            onClose={() => setOpenPopup(null)}
            onSave={handlePopupAction}
            ActionButtonText={"save"}
            disableSaveButton={
              showedList.title === newListTitle || newListTitle === ""
            }
          >
            <EditeTodoList
              user={currentUser}
              handleInputChange={handleInputChange}
              listTitle={showedList.title}
            />
          </Popup>
        );
      case "delete":
        return (
          <Popup
            isOpen={openPopup.length > 0}
            title={"Delete list"}
            onClose={() => setOpenPopup(null)}
            onSave={handlePopupAction}
            ActionButtonText={"delete"}
          >
            <Text>
              Are you sure you want to delete "{showedList.title}" list?
            </Text>
          </Popup>
        );
      default:
        return null;
    }
  }

  if (isLoading) return <Text>Loading...</Text>;
  if (isSuccess && todoList)
    return (
      <>
        <Flex
          w="100%"
          flexDirection={{ base: "column", lg: "row" }}
          placeContent="center"
          justifyContent="start"
          gap={convertPx(20)}
          mb={convertPx(16)}
        >
          <Box>{renderDropdownContent()}</Box>
          <Spacer display={{ base: "none", lg: "block" }} />
          <HStack>
            <ButtonItem
              bg="themeColor"
              color="white"
              flexGrow={1}
              onClick={() => setOpenPopup("edit")}
              display={editable ? "flex" : "none"}
            >
              Edit list
            </ButtonItem>
            <ButtonItem
              bg="redColor"
              color="white"
              flexGrow={1}
              onClick={() => setOpenPopup("delete")}
              display={editable ? "flex" : "none"}
            >
              Delete list
            </ButtonItem>
            <ButtonItem
              bg="themeColor"
              color="white"
              flexGrow={1}
              onClick={() => setOpenPopup("create")}
              disabled={!isAuthenticated}
            >
              Create list
            </ButtonItem>
          </HStack>
        </Flex>

        <Box>{renderListContent()}</Box>

        {/* create list popup */}
        <Box>{renderPopupContent()}</Box>
      </>
    );
}
