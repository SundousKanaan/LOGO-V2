import { useAuth } from "../contexts/AuthContext";

export const usePermissions = () => {
  const { currentUser } = useAuth();
  const checkListPermissions = (list) => {
    if (!list) return false;
    if (currentUser?.user_type === "admin" || currentUser?.id === list?.owner) {
      return true;
    }
    return false;
  };

  const checkUserEditPermissions = (user) => {
    if (!user) return;
    if (user.user_type === "admin") return true;
    return false;
  };

  return {
    checkListPermissions,
    checkUserEditPermissions,
  };
};
