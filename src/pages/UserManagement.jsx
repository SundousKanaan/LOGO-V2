import { useState, useEffect } from "react";
import { Table, Icon, Skeleton, Avatar, Text, HStack } from "@chakra-ui/react";
import { useGetAllUsers } from "../services/users";
import { MdModeEdit, MdOutlineDeleteForever } from "react-icons/md";
import { convertPx } from "../hooks/useConvertPx";
import { useAuth } from "../contexts/AuthContext";
import { putUser, deleteUser } from "../services/users";
import { useQueryClient } from "react-query";
import { UsePickRandomColor } from "../hooks/usePickRandomColor";

import Popup from "../components/mini-components/Popup";
import EditeUser from "../components/forms-components/EditeUser";
import ButtonItem from "../components/mini-components/ButtonItem";

function UserManagement() {
  const { data: users, isLoading, isFetched } = useGetAllUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(null);
  const { currentUser } = useAuth();
  const [errorEditeMessage, setErrorEditeMessage] = useState(null);
  const [canBeUpdated, setCanBeUpdated] = useState(false);
  const queryClient = useQueryClient();

  const handleOpenEditPopup = (user) => {
    setSelectedUser(user);
    setIsPopupOpen("edite");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "firstName") {
      setSelectedUser((prevUser) => ({
        ...prevUser,
        first_name: value.trim(),
      }));
    } else if (name === "lastName") {
      setSelectedUser((prevUser) => ({
        ...prevUser,
        last_name: value.trim(),
      }));
    } else if (name === "phone") {
      setSelectedUser((prevUser) => ({
        ...prevUser,
        phone: value.trim(),
      }));
    } else if (name === "birthday") {
      setSelectedUser((prevUser) => ({
        ...prevUser,
        birthday: value.trim(),
      }));
    }
  };

  useEffect(() => {
    if (!selectedUser) return;
    const isValid_F_Name =
      selectedUser.first_name !== "" &&
      /^[A-Za-z]+$/.test(selectedUser.first_name);
    const isValid_L_Name =
      selectedUser.last_name !== "" &&
      /^[A-Za-z]+$/.test(selectedUser.last_name);

    const isValid_phone =
      (selectedUser.phone && /^\+\d{1,3}\d{6,14}$/.test(selectedUser.phone)) ||
      selectedUser.phone === "";

    if (!isValid_F_Name || !isValid_L_Name) {
      setErrorEditeMessage({
        type: "name",
        message: "Please check the first and last name format.",
      });
      setCanBeUpdated(false);
    } else if (!isValid_phone) {
      console.log("Valid phone number:", selectedUser.phone);
      setErrorEditeMessage({
        type: "phone",
        message: "Please check the phone number format.",
      });
      setCanBeUpdated(false);
    } else {
      setCanBeUpdated(true);
      setErrorEditeMessage(null);
    }
  }, [selectedUser]);

  async function handleUpdateUser() {
    console.log("Updating user:", selectedUser);
    if (!selectedUser) return;
    const reqData = {
      firebase_uid: selectedUser.firebase_uid,
      first_name: selectedUser.first_name,
      last_name: selectedUser.last_name,
      email: selectedUser.email,
      phone: selectedUser.phone || "",
      birthday: selectedUser.birthday || "",
      is_active: selectedUser.is_active || true,
      user_type: selectedUser.user_type,
    };

    await putUser(reqData);
    queryClient.invalidateQueries(["allUsers"]);
    setIsPopupOpen(false);
    setSelectedUser(null);
    setErrorEditeMessage(null);
  }

  function handleOpenDeletePopup(user) {
    setSelectedUser(user);
    setIsPopupOpen("delete");
  }

  async function handleDeleteUser() {
    if (!selectedUser) return;
    await deleteUser(selectedUser.firebase_uid);
    queryClient.invalidateQueries(["allUsers"]);
    setIsPopupOpen(null);
    setSelectedUser(null);
  }

  function rerenderPopup() {
    switch (isPopupOpen) {
      case "edite":
        return (
          <Popup
            isOpen
            title={"Edit User"}
            onClose={() => {
              setIsPopupOpen(false);
              setSelectedUser(null);
              setErrorEditeMessage(null);
            }}
            onSave={handleUpdateUser}
            ActionButtonText={"Save"}
            disableSaveButton={!canBeUpdated}
          >
            <EditeUser
              user={selectedUser}
              errorState={errorEditeMessage}
              handleInputChange={(e) => handleInputChange(e)}
              handleRoleChange={(option) =>
                setSelectedUser((prevUser) => ({
                  ...prevUser,
                  user_type: option.value[0],
                }))
              }
            />
            {errorEditeMessage && <Text>{errorEditeMessage.message}</Text>}
          </Popup>
        );
      case "delete":
        return (
          <Popup
            isOpen
            title={"Delete User"}
            onClose={() => {
              setIsPopupOpen(null);
              setSelectedUser(null);
            }}
            onSave={handleDeleteUser}
            ActionButtonText={"Delete"}
          >
            <Text fontSize={convertPx(16)}>
              Are you sure you want to delete{" "}
              <Text
                as={"span"}
                fontWeight={"bold"}
                textTransform={"capitalize"}
                textDecor={"underline"}
              >
                {selectedUser?.first_name} {selectedUser?.last_name}
              </Text>{" "}
              from the users list?
            </Text>
            <Text
              color={"redColor"}
              fontSize={convertPx(14)}
              mt={convertPx(16)}
            >
              This action cannot be undone. Please confirm to proceed with the
              deletion.
            </Text>
          </Popup>
        );

      default:
        return null;
    }
  }

  return (
    <Skeleton loading={isLoading && !isFetched} minH="100%">
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row background={"themeColor"} borderRadius={"md"}>
            <Table.ColumnHeader></Table.ColumnHeader>
            {currentUser && currentUser?.user_type === "admin" && (
              <Table.ColumnHeader
                color={"white"}
                fontWeight={"600"}
                textAlign={"center"}
              >
                Actions
              </Table.ColumnHeader>
            )}
            <Table.ColumnHeader color={"white"} fontWeight={"600"}>
              Avatar
            </Table.ColumnHeader>
            <Table.ColumnHeader
              color={"white"}
              fontWeight={"600"}
              textWrap={"nowrap"}
            >
              First Name
            </Table.ColumnHeader>
            <Table.ColumnHeader
              color={"white"}
              fontWeight={"600"}
              textWrap={"nowrap"}
            >
              Last Name
            </Table.ColumnHeader>
            <Table.ColumnHeader
              color={"white"}
              fontWeight={"600"}
              textWrap={"nowrap"}
            >
              Email
            </Table.ColumnHeader>
            <Table.ColumnHeader
              color={"white"}
              fontWeight={"600"}
              textWrap={"nowrap"}
            >
              Birthday
            </Table.ColumnHeader>
            <Table.ColumnHeader color={"white"} fontWeight={"600"}>
              Role
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users &&
            users.map((item, index) => (
              <Table.Row
                key={index}
                h={convertPx(60)}
                bg="white"
                color="secondaryColor"
              >
                <Table.Cell pl={convertPx(24)}>{index + 1}</Table.Cell>

                {currentUser && currentUser?.user_type === "admin" && (
                  <Table.Cell width={convertPx(70)}>
                    <HStack gap={0}>
                      <ButtonItem
                        variant="solid"
                        size="md"
                        h={convertPx(30)}
                        p={convertPx(8)}
                        pr={convertPx(8)}
                        bg="transparent"
                        onClick={() => handleOpenEditPopup(item)}
                        _hover={{
                          boxShadow:
                            " inset 0 0 0 0.06em var(--chakra-colors-theme-color)",
                        }}
                      >
                        <Icon as={MdModeEdit} color="secondaryColor" />
                      </ButtonItem>
                      <ButtonItem
                        variant="solid"
                        size="md"
                        h={convertPx(30)}
                        p={convertPx(8)}
                        pr={convertPx(8)}
                        bg="transparent"
                        onClick={() => handleOpenDeletePopup(item)}
                        _hover={{
                          boxShadow:
                            " inset 0 0 0 0.06em var(--chakra-colors-theme-color)",
                        }}
                      >
                        <Icon
                          as={MdOutlineDeleteForever}
                          color="secondaryColor"
                        />
                      </ButtonItem>
                    </HStack>
                  </Table.Cell>
                )}
                <Table.Cell>
                  <Avatar.Root
                    size="sm"
                    colorPalette={UsePickRandomColor(
                      `${item.first_name} ${item.last_name}`
                    )}
                  >
                    <Avatar.Fallback
                      name={`${item.first_name} ${item.last_name}`}
                    />
                    <Avatar.Image
                      src={currentUser?.photo}
                      alt={`${currentUser?.first_name} ${currentUser?.last_name} profile photo`}
                    />
                  </Avatar.Root>
                </Table.Cell>
                <Table.Cell textWrap={"nowrap"} textTransform={"capitalize"}>
                  {item.first_name}
                </Table.Cell>
                <Table.Cell textWrap={"nowrap"} textTransform={"capitalize"}>
                  {item.last_name}
                </Table.Cell>
                <Table.Cell textWrap={"nowrap"}>{item.email}</Table.Cell>
                <Table.Cell textWrap={"nowrap"}>{item.birthday}</Table.Cell>
                <Table.Cell textWrap={"nowrap"} textTransform={"capitalize"}>
                  {item.user_type}
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>

      {isPopupOpen && rerenderPopup()}
    </Skeleton>
  );
}

export default UserManagement;
