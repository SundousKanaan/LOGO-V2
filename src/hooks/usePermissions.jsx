import { useAuth } from "../contexts/AuthContext";

export const useListPermissions = (list) => {
  const { currentUser } = useAuth();
  if (currentUser?.role === "admin") {
    return true;
  }
  if (list?.owner === currentUser?.uid) {
    return true;
  }

  return false;
};

export const useListItemPermissions = (item) => {
  const { currentUser } = useAuth();
  const hasListPermission = useListPermissions(item?.todo_list);

  if (currentUser?.role === "admin") {
    return true;
  }

  if (hasListPermission) {
    return true;
  }

  return false;
};
