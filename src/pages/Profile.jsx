import { useEffect, useState, useCallback } from "react";
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
import { useTodolist } from "../services/todoList/getTodoList";
import { postTodoList } from "../services/todoList/postTodoList";
import { updateTodoList } from "../services/todoList/updateTodoList";
import { deleteTodoList } from "../services/todoList/deleteTodoList";
import { useListPermissions } from "../hooks/usePermissions";
import { postTodoItem } from "../services/todoItem/postTodoItem";
import { deleteTodoItem } from "../services/todoItem/deleteTodoItem";
import { updateTodoItem } from "../services/todoItem/updateTodoItem";

import Dropdown from "../components/mini-components/Dropdown";
import ButtonItem from "../components/mini-components/ButtonItem";
import Popup from "../components/mini-components/Popup";
import AddNewTodoList from "../components/forms-components/AddNewTodoList";
import EditeTodoList from "../components/forms-components/EditeTodoList";
import TodoList from "../components/TodoList";
import TodoColumn from "../components/mini-components/TodoColumn";
import TodoItem from "../components/mini-components/todoItem";
import AddNewTodoItem from "../components/forms-components/AddNewTodoItem";
import EditeTodoItem from "../components/forms-components/EditeTodoItem";

export default function Profile() {
  // Hooks
  const { isAuthenticated, currentUser } = useAuth();
  const { checkPermissions } = useListPermissions();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State
  const [selectedList, setSelectedList] = useState(null);
  const [listDropdownCollection, setListDropdownCollection] = useState();
  const [openListPopup, setOpenListPopup] = useState(null);
  const [openItemPopup, setOpenItemPopup] = useState(null);
  const [listTitle, setListTitle] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [newTaskDetails, setNewTaskDetails] = useState(null);

  // Data fetching
  const {
    data: todoLists,
    isLoading: isListsLoading,
    refetch: refetchTodoLists,
  } = useTodolists(["id", "title", "owner"]);

  const { data: listData, isLoading: isListLoading } = useTodolist(
    selectedList?.id || null
  );

  // Effects
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

  // Initiële selectie
  useEffect(() => {
    if (!isListsLoading && todoLists?.length > 0 && !selectedList) {
      setSelectedList(todoLists[0]);
      setListTitle(todoLists[0].title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todoLists, isListsLoading]);

  useEffect(() => {
    if (!selectedList) return;

    const dropdownCollection = createListCollection({
      items: todoLists.map((item) => ({
        label: item.title,
        value: item.id,
      })),
    });
    setListDropdownCollection(dropdownCollection);
  }, [selectedList, todoLists]);

  useEffect(() => {
    if (!selectedList) return;
    const isEditable = checkPermissions(selectedList);
    setIsEditable(isEditable);
    console.log("selectedList", selectedList);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedList]);

  // Handlers
  async function handleChangeList(data) {
    const selected = todoLists.find((item) => item.id === data.value[0]);
    setSelectedList(selected);
    setListTitle(selected.title);
    queryClient.invalidateQueries("dbTodolist");
  }

  function handleInputChange(e) {
    setListTitle(e.target.value);
  }

  function openCreateItemPopup(colTitle) {
    setNewTaskDetails(null);
    setOpenItemPopup({ case: "create", title: colTitle });
  }

  const handleNewTaskChange = useCallback((formData) => {
    setNewTaskDetails(formData);
  }, []);

  // Popups Actions
  // list handlers
  async function handlePopupAction() {
    if (openListPopup === "create") return await handleCreateList();
    if (openListPopup === "delete") return await handleDeleteList();
    if (openListPopup === "edit") return await handleEditList();
  }

  async function handleCreateList() {
    await postTodoList({ title: listTitle, owner: currentUser.uid });
    const { data: updatedData } = await refetchTodoLists();
    const newList = updatedData.find(
      (item) => item.title === listTitle && item.owner === currentUser.uid
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
    };
    await updateTodoList(updatedListData);
    queryClient.invalidateQueries("dbTodolists");
    queryClient.invalidateQueries("dbTodolist");

    setSelectedList(updatedListData);
    setOpenListPopup(null);
  }

  async function handleDeleteList() {
    await deleteTodoList(selectedList.id);
    setOpenListPopup(null);
    setSelectedList(null);
    queryClient.invalidateQueries("dbTodolists");
  }

  // list items handlers
  async function handleCreateListItem() {
    await postTodoItem(newTaskDetails);
    setOpenItemPopup(null);
    queryClient.invalidateQueries("dbTodolist");
  }

  async function handleDeleteListItem(taskId) {
    await deleteTodoItem(taskId);
    setOpenItemPopup(null);
    queryClient.invalidateQueries("dbTodolist");
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
    setOpenItemPopup(null);
    setNewTaskDetails(null);
    queryClient.invalidateQueries("dbTodolist");
  }

  // Validation
  function isTaskDetailsValid(form) {
    return (
      form && form.title && form.title.trim() !== "" && form.assignee.length > 0
    );
  }

  // Renderers
  function renderListsDropdown() {
    if (
      listDropdownCollection &&
      Array.isArray(listDropdownCollection.items) &&
      listDropdownCollection.items.length > 0
    ) {
      return (
        <Dropdown
          collection={listDropdownCollection}
          defaultValue={selectedList?.id} // todo: fix this
          placeholder={selectedList?.title}
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
          {listDropdownCollection.items.map((list) => (
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
      />
    );
  }

  function renderListPopup() {
    switch (openListPopup) {
      case "create":
        return (
          <Popup
            isOpen
            title={"Create new list"}
            onClose={() => setOpenListPopup(null)}
            onSave={handlePopupAction}
            ActionButtonText={"create"}
            disableSaveButton={listTitle === ""}
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
            isOpen
            title={"Edit list"}
            onClose={() => setOpenListPopup(null)}
            onSave={handlePopupAction}
            ActionButtonText={"save"}
            disableSaveButton={
              selectedList.title === listTitle || listTitle === ""
            }
          >
            <EditeTodoList
              user={currentUser}
              handleInputChange={handleInputChange}
              listTitle={selectedList.title}
            />
          </Popup>
        );
      case "delete":
        return (
          <Popup
            isOpen
            title={"Delete list"}
            onClose={() => setOpenListPopup(null)}
            onSave={handlePopupAction}
            ActionButtonText={"delete"}
          >
            <Text>
              Are you sure you want to delete "{selectedList.title}" list?
            </Text>
          </Popup>
        );
      default:
        return null;
    }
  }

  function renderItemPopup() {
    switch (openItemPopup?.case) {
      case "create": {
        return (
          <Popup
            title={"New Task"}
            isOpen
            selectedCol={openItemPopup.title}
            colTitle={openItemPopup.title}
            onSave={handleCreateListItem}
            onClose={() => {
              setOpenItemPopup(null);
              setNewTaskDetails(null);
            }}
            disableSaveButton={!isTaskDetailsValid(newTaskDetails)}
          >
            <AddNewTodoItem
              defaultStatus={openItemPopup.title}
              assignedList={selectedList}
              onFormChange={handleNewTaskChange}
            />
          </Popup>
        );
      }
      case "delete": {
        return (
          <Popup
            isOpen={true}
            title={`Delete ${openItemPopup.title}`}
            ActionButtonText="Delete task"
            onClose={() => setOpenItemPopup(null)}
            onSave={() => {
              handleDeleteListItem(openItemPopup.id);
            }}
          >
            <Text>Are you sure you want to delete this task?</Text>
            <Text color={"redColor"} fontWeight={600} mt={convertPx(16)}>
              This action cannot be undone. Please confirm to proceed.
            </Text>
          </Popup>
        );
      }
      case "edit": {
        return (
          <Popup
            isOpen={true}
            title={`Edit ${openItemPopup.title}`}
            ActionButtonText="Save changes"
            onClose={() => setOpenItemPopup(null)}
            onSave={() => handleEditListItem(newTaskDetails)}
          >
            <EditeTodoItem
              data={listData.items.find((item) => item.id === openItemPopup.id)}
              assignedList={selectedList}
              onChange={(updatedData) => {
                setNewTaskDetails(updatedData);
              }}
            />
          </Popup>
        );
      }

      default:
        return null;
    }
  }

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
        <Box>{renderListsDropdown()}</Box>
        <Spacer display={{ base: "none", lg: "block" }} />
        <HStack>
          <ButtonItem
            bg="themeColor"
            color="white"
            flexGrow={1}
            onClick={() => setOpenListPopup("edit")}
            display={isEditable ? "flex" : "none"}
          >
            Edit list
          </ButtonItem>
          <ButtonItem
            bg="redColor"
            color="white"
            flexGrow={1}
            onClick={() => setOpenListPopup("delete")}
            display={isEditable ? "flex" : "none"}
          >
            Delete list
          </ButtonItem>
          <ButtonItem
            bg="themeColor"
            color="white"
            flexGrow={1}
            onClick={() => setOpenListPopup("create")}
            disabled={!isAuthenticated}
          >
            Create list
          </ButtonItem>
        </HStack>
      </Flex>
      {isListLoading ? (
        <Text color="secondaryColor">Loading...</Text> // todo: loading state
      ) : (
        <TodoList>
          {
            !isListLoading &&
              listData?.items &&
              ["pending", "in_progress", "done"].map((colTitle, index) => (
                <TodoColumn
                  key={index}
                  title={colTitle}
                  count={
                    listData.items.filter((item) => item.status === colTitle)
                      .length
                  }
                  handleOpenPopup={() => openCreateItemPopup(colTitle)}
                  isEditable={!isEditable}
                >
                  {listData.items
                    .filter((item) => item.status === colTitle)
                    .map((item, index) => (
                      <TodoItem
                        key={index}
                        data={item}
                        listMembers={listData.members}
                        isEditable={isEditable}
                        handleDeleteItem={() =>
                          setOpenItemPopup({
                            case: "delete",
                            title: item.title,
                            id: item.id,
                          })
                        }
                        handleEditItem={() =>
                          setOpenItemPopup({
                            case: "edit",
                            title: item.title,
                            id: item.id,
                          })
                        }
                        handleStatusChange={(newStatus) => {
                          handleEditListItem({
                            ...item,
                            assignee: item.assignee.map(
                              (user) => user.firebase_uid
                            ),
                            status: newStatus["value"][0],
                          });
                        }}
                      />
                    ))}
                </TodoColumn>
              ))
            // : (
            //   <Text>No tasks found</Text> // todo: empty List
            // )
          }
        </TodoList>
      )}

      {/* popups */}
      {renderListPopup()}
      {renderItemPopup()}
    </>
  );
}
