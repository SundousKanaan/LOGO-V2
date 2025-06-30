import { useAuth } from "../contexts/AuthContext";

export const useListPermissions = () => {
  const { currentUser } = useAuth();
  function checkPermissions(list) {
    if (!list) return false;

    if (
      currentUser?.user_type === "admin" ||
      currentUser?.uid === list?.owner
    ) {
      return true;
    }

    return false;
  }

  return {
    checkPermissions,
  };
};
