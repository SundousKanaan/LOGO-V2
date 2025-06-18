import { useAuth } from "../contexts/AuthContext";

export const useListPermissions = () => {
  const { currentUser } = useAuth();
  function checkPermissions(list) {
    if (!list) return false;

    if (currentUser?.role === "admin" || currentUser?.uid === list?.owner) {
      return true;
    }

    return false;
  }

  return {
    checkPermissions,
  };
};
