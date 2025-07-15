import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { UserPopup } from "../components/ProfilePopups";
import { useUserHandlers } from "../hooks/useUserHandlers";
import { useAllUsers } from "../hooks/useUserHooks";
import { usePermissions } from "../hooks/usePermissions";
import UsersTable from "../components/UsersTabel";

function UserManagement() {
  const { currentUser, logout } = useAuth();
  const { checkUserEditPermissions } = usePermissions();
  const { data: users, isLoading, isFetched } = useAllUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const [canBeUpdated, setCanBeUpdated] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
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
    logout,
  });

  return (
    <>
      <UsersTable
        data={users}
        headerTitles={[
          "Avatar",
          "First Name",
          "Last Name",
          "Email",
          "Birthday",
          "Role",
        ]}
        isDataLoading={isLoading}
        isDataFetched={isFetched}
        canBeUpdated={canBeUpdated}
        selectedId={selectedUser?.id}
        isUpdating={isUpdatingUser}
        isDeleting={isDeletingUser}
        onEdit={(user) => {
          setHandledUser(user);
          setSelectedUser(user);
          setOpenUserPopup("edit");
        }}
        onDelete={(user) => {
          setHandledUser(user);
          setSelectedUser(user);
          setOpenUserPopup("delete");
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
