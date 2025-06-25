import { useState, useEffect } from "react";
import { Table, Icon, Skeleton, Text } from "@chakra-ui/react";
import { useGetAllUsers } from "../services/users";
import ButtonItem from "../components/mini-components/ButtonItem";
import { MdModeEdit } from "react-icons/md";
import { convertPx } from "../hooks/useConvertPx";
import Popup from "../components/mini-components/Popup";
import { useAuth } from "../contexts/AuthContext";
import EditeUser from "../components/forms-components/EditeUser";
import { putUser } from "../services/users";
import { useQueryClient } from "react-query";

function UserManagement() {
  const { data: users, isLoading, isFetched } = useGetAllUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { currentUser } = useAuth();
  const [errorEditeMessage, setErrorEditeMessage] = useState(null);
  const [canBeUpdated, setCanBeUpdated] = useState(false);
  const queryClient = useQueryClient();

  const handleEditItem = (user) => {
    setSelectedUser(user);
    setIsPopupOpen(true);
  };

  const handleChangeName = (e) => {
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
      data: {
        firebase_uid: selectedUser.firebase_uid,
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        email: selectedUser.email,
        phone: selectedUser.phone || "",
        birthday: selectedUser.birthday || "",
        is_active: selectedUser.is_active || true,
        user_type: selectedUser.user_type,
      },
    };

    await putUser(reqData);
    queryClient.invalidateQueries(["allUsers"]);
    setIsPopupOpen(false);
    setSelectedUser(null);
    setErrorEditeMessage(null);
  }

  return (
    <Skeleton loading={isLoading && !isFetched} minH="100%">
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row background={"themeColor"} borderRadius={"md"}>
            {currentUser && currentUser.role === "admin" && (
              <Table.ColumnHeader
                color={"white"}
                fontWeight={"600"}
              ></Table.ColumnHeader>
            )}
            <Table.ColumnHeader color={"white"} fontWeight={"600"}>
              First Name
            </Table.ColumnHeader>
            <Table.ColumnHeader color={"white"} fontWeight={"600"}>
              Last Name
            </Table.ColumnHeader>
            <Table.ColumnHeader color={"white"} fontWeight={"600"}>
              Email
            </Table.ColumnHeader>
            <Table.ColumnHeader color={"white"} fontWeight={"600"}>
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
                {currentUser && currentUser.role === "admin" && (
                  <Table.Cell width={convertPx(70)}>
                    <ButtonItem
                      variant="solid"
                      size="md"
                      h={convertPx(30)}
                      p={convertPx(8)}
                      pr={convertPx(8)}
                      bg="transparent"
                      onClick={() => handleEditItem(item)}
                      // display={isEditable ? "flex" : "none"}
                      // disabled={isTemporary}
                      _hover={{
                        boxShadow:
                          " inset 0 0 0 0.06em var(--chakra-colors-theme-color)",
                      }}
                    >
                      <Icon as={MdModeEdit} color="secondaryColor" />
                    </ButtonItem>
                  </Table.Cell>
                )}
                <Table.Cell>{item.first_name}</Table.Cell>
                <Table.Cell>{item.last_name}</Table.Cell>
                <Table.Cell>{item.email}</Table.Cell>
                <Table.Cell>{item.birthday}</Table.Cell>
                <Table.Cell>{item.user_type}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>

      {isPopupOpen && (
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
            handleChangeName={(e) => handleChangeName(e)}
            handleRoleChange={(option) =>
              setSelectedUser((prevUser) => ({
                ...prevUser,
                user_type: option.value[0],
              }))
            }
          />
          {errorEditeMessage && <Text>{errorEditeMessage.message}</Text>}
        </Popup>
      )}
    </Skeleton>
  );
  // }
}

export default UserManagement;
