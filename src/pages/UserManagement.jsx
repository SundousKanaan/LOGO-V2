import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { UserPopup } from "../components/ProfilePopups";
import { useUserHandlers } from "../hooks/useUserHandlers";
import { useGetAllUsers } from "../services/usersServices";
import { usePermissions } from "../hooks/usePermissions";
import UsersTable from "../components/UsersTabel";

function UserManagement() {
  const { currentUser, logout } = useAuth();
  const { checkUserEditPermissions } = usePermissions();
  const { data: users, isLoading, isFetched } = useGetAllUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const [canBeUpdated, setCanBeUpdated] = useState(true);

  useEffect(() => {
    setCanBeUpdated(checkUserEditPermissions(currentUser));
  }, [currentUser]);

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
    initialUser: selectedUser,
    queryKey: "allUsers",
    logout: () => {
      if (selectedUser?.id === currentUser?.id) {
        logout();
      }
    },
  });

  const handleOpenEditPopup = (user) => {
    setSelectedUser(user);
    setOpenUserPopup("edit");
  };

  function handleOpenDeletePopup(user) {
    setSelectedUser(user);
    setOpenUserPopup("delete");
  }

  return (
    <>
      <UsersTable
        data={users}
        isDataLoading={isLoading}
        isDataFetched={isFetched}
        canBeUpdated={canBeUpdated}
        selectedId={selectedUser?.id}
        isUpdating={isUpdatingUser}
        isDeleting={isDeletingUser}
        onEdit={(user) => {
          handleOpenEditPopup(user);
        }}
        onDelete={(user) => {
          handleOpenDeletePopup(user);
        }}
      />

      <UserPopup
        openUserPopup={openUserPopup}
        user={handledUser}
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

export default UserManagement;
