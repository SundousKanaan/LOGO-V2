import { useState, useEffect } from "react";
import { Table, Icon, Skeleton, Avatar, Text, HStack } from "@chakra-ui/react";
import { MdModeEdit, MdOutlineDeleteForever } from "react-icons/md";
import { convertPx } from "../hooks/useConvertPx";
import { useAuth } from "../contexts/AuthContext";
import {
  useUpdateUser,
  useDeleteUser,
  useGetAllUsers,
  useValidateProfile,
} from "../services/usersServices";
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
  const { mutate: updateUser, isLoading: isUpdatingUser } = useUpdateUser();
  const { mutate: deleteUser, isLoading: isDeletingUser } = useDeleteUser();

  const validateProfile = useValidateProfile();

  const handleOpenEditPopup = (user) => {
    setSelectedUser(user);
    setIsPopupOpen("edit");
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
    validateProfile.mutate(selectedUser, {
      onSuccess: () => {
        setCanBeUpdated(true);
        setErrorEditeMessage(null);
      },

      onError: (err) => {
        const error = err.response.data.errors;
        setCanBeUpdated(false);
        if (error.first_name || error.last_name) {
          setErrorEditeMessage({
            type: error.first_name?.[0] ? "first_name" : "last_name",
            message: error.first_name?.[0] || error.last_name?.[0],
          });
        } else if (error.phone) {
          setErrorEditeMessage({
            type: "phone",
            message: error.phone[0],
          });
        } else if (error.birthday) {
          setErrorEditeMessage({
            type: "birthday",
            message: error.birthday[0],
          });
        }
      },
    });
  }, [selectedUser]);

  async function handleUpdateUser() {
    if (!selectedUser) return;
    const data = {
      id: selectedUser.id,
      first_name: selectedUser.first_name,
      last_name: selectedUser.last_name,
      email: selectedUser.email,
      phone: selectedUser.phone || "",
      birthday: selectedUser.birthday || "",
      is_active: selectedUser.is_active || true,
      user_type: selectedUser.user_type,
    };

    updateUser(data, {
      onSuccess: () => {
        queryClient.invalidateQueries(["allUsers"]);
        setIsPopupOpen(false);
        setSelectedUser(null);
        setErrorEditeMessage(null);
      },
    });
  }

  function handleOpenDeletePopup(user) {
    setSelectedUser(user);
    setIsPopupOpen("delete");
  }

  async function handleDeleteUser() {
    if (!selectedUser) return;
    deleteUser(selectedUser.id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["allUsers"]);
        setIsPopupOpen(null);
        setSelectedUser(null);
      },
    });
  }

  function rerenderPopup() {
    return (
      <Popup
        isOpen
        title={isPopupOpen === "edit" ? "Edit User" : "Delete user"}
        onClose={() => {
          setIsPopupOpen(false);
          setSelectedUser(null);
          setErrorEditeMessage(null);
        }}
        onSave={isPopupOpen === "edit" ? handleUpdateUser : handleDeleteUser}
        ActionButtonText={isPopupOpen === "edit" ? "Save" : "Delete"}
        disableSaveButton={
          (isPopupOpen === "edit" && !canBeUpdated) ||
          isDeletingUser ||
          isUpdatingUser
        }
      >
        {isPopupOpen === "edit" && (
          <>
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
            {errorEditeMessage && (
              <Text color={"redColor"} mt={convertPx(16)} textAlign={"center"}>
                {errorEditeMessage.message}
              </Text>
            )}
          </>
        )}

        {isPopupOpen === "delete" && (
          <>
            <Text fontSize={convertPx(16)}>
              Are you sure you want to delete
              <Text
                as={"span"}
                fontWeight={"bold"}
                textTransform={"capitalize"}
                textDecor={"underline"}
              >
                {selectedUser?.first_name} {selectedUser?.last_name}
              </Text>
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
          </>
        )}
      </Popup>
    );
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
