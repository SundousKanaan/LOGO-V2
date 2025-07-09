import { Text } from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";

import Popup from "./mini-components/Popup";
import AddNewTodoList from "./forms-components/AddNewTodoList";
import EditeTodoList from "./forms-components/EditeTodoList";
import AddNewTodoItem from "./forms-components/AddNewTodoItem";
import EditeTodoItem from "./forms-components/EditeTodoItem";
import EditeUser from "./forms-components/EditeUser";

export function ListPopup({
  user,
  openListPopup,
  selectedList,
  listTitle,
  handleInputChange,
  handleCreateList,
  handleEditList,
  handleDeleteList,
  setOpenListPopup,
  isProcessing,
}) {
  if (!openListPopup) return;
  const titles = {
    create: "Create new list",
    edit: "Edit list",
    delete: "Delete list",
  };

  const saveButtonTexts = {
    create: "Create",
    edit: "Edit",
    delete: "Delete",
  };

  const isCreate = openListPopup === "create";
  const isEdit = openListPopup === "edit";
  const isDelete = openListPopup === "delete";

  return (
    <Popup
      isOpen
      title={titles[openListPopup]}
      onClose={() => setOpenListPopup(null)}
      onSave={() => {
        if (isCreate) return handleCreateList();
        if (isEdit) return handleEditList();
        if (isDelete) return handleDeleteList();
      }}
      ActionButtonText={
        saveButtonTexts[openListPopup] ||
        (isDelete && isProcessing && "Deleting...")
      }
      disableSaveButton={
        isProcessing ||
        (!isDelete && (selectedList?.title === listTitle || listTitle === ""))
      }
    >
      {isCreate && (
        <AddNewTodoList user={user} handleInputChange={handleInputChange} />
      )}
      {isEdit && (
        <EditeTodoList
          user={user}
          handleInputChange={handleInputChange}
          listTitle={selectedList.title}
        />
      )}
      {isDelete && (
        <Text>
          Are you sure you want to delete "{selectedList.title}" list?
        </Text>
      )}
    </Popup>
  );
}

export function ListItemPopup({
  list,
  openItemPopup,
  newListItemDetails,
  handleCreateListItem,
  handleEditListItem,
  handleDeleteListItem,
  setOpenItemPopup,
  handleNewTaskChange,
  isProcessing,
}) {
  if (!openItemPopup) return;
  const { case: type, title, id } = openItemPopup;

  const isCreate = type === "create";
  const isEdit = type === "edit";
  const isDelete = type === "delete";

  return (
    <Popup
      isOpen
      title={
        isCreate
          ? "Create new Task"
          : isEdit
          ? `Edite ${title}`
          : `Delete ${title}`
      }
      selectedCol={title}
      colTitle={title}
      onSave={() => {
        if (isCreate) return handleCreateListItem();
        if (isEdit) return handleEditListItem(newListItemDetails);
        if (isDelete) {
          return handleDeleteListItem(id);
        }
      }}
      onClose={() => {
        setOpenItemPopup(null);
      }}
      ActionButtonText={
        isCreate
          ? "Create"
          : isEdit
          ? "Save"
          : isDelete && isProcessing
          ? "Deleting..."
          : "Delete"
      }
      disableSaveButton={
        isProcessing ||
        ((isCreate || isEdit) &&
          (newListItemDetails?.title === "" ||
            !Array.isArray(newListItemDetails?.assignee) ||
            newListItemDetails?.assignee.length === 0))
      }
    >
      {isCreate && (
        <AddNewTodoItem
          defaultStatus={title}
          assignedList={{ id: list.id, title: list.title }}
          onFormChange={handleNewTaskChange}
        />
      )}
      {isEdit && (
        <EditeTodoItem
          data={list.items.find((item) => item.id === id)}
          assignedList={{ id: list.id, title: list.title }}
          onChange={handleNewTaskChange}
        />
      )}
      {isDelete && (
        <>
          <Text fontSize={convertPx(16)}>
            Are you sure you want to delete this task?
          </Text>
          <Text color={"redColor"} fontSize={convertPx(14)} mt={convertPx(16)}>
            This action cannot be undone. Please confirm to proceed with the
            deletion.
          </Text>
        </>
      )}
    </Popup>
  );
}

export function UserPopup({
  openUserPopup,
  user,
  errorEditMessage,
  handleUpdateUser,
  handleDeleteUser,
  setOpenUserPopup,
  handleUserDataChange,
  setAccountData,
  setErrorEditMessage,
  isProcessing,
}) {
  if (!openUserPopup) return;

  const isEdit = openUserPopup === "edit";
  const isDelete = openUserPopup === "delete";

  return (
    <Popup
      title={isEdit ? "Edit Account" : "Delete Account"}
      isOpen
      onClose={() => {
        setOpenUserPopup(false);
        setErrorEditMessage(null);
        setAccountData(null);
      }}
      onSave={isEdit ? handleUpdateUser : handleDeleteUser}
      ActionButtonText={isEdit ? "Save" : "Delete"}
      disableSaveButton={errorEditMessage || isProcessing}
    >
      {isEdit && (
        <>
          <EditeUser
            user={user}
            errorState={null}
            handleInputChange={(e) => handleUserDataChange(e)}
            handleRoleChange={(option) =>
              setAccountData((prevData) => ({
                ...prevData,
                user_type: option.value[0],
              }))
            }
          />
          {errorEditMessage && (
            <Text color={"redColor"} mt={convertPx(16)} textAlign={"center"}>
              {errorEditMessage.message}
            </Text>
          )}
        </>
      )}
      {isDelete && (
        <>
          <Text>Are you sure you want to delete this account?</Text>
          <Text color={"redColor"} fontSize={convertPx(14)} mt={convertPx(16)}>
            This action cannot be undone. Please confirm to proceed with the
            deletion.
          </Text>
        </>
      )}
    </Popup>
  );
}
