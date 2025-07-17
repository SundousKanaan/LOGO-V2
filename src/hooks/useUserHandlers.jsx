import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";
import { updateUser, deleteUser } from "../services/api";
import { useValidateProfile } from "../hooks/useUserHooks";
import { useAuth } from "../contexts/AuthContext";
import { validateUserDataLocally } from "../hooks/useLocalValidates";

export function useUserHandlers({ initialUser, logout, queryKey = "auth" }) {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [handledUser, setHandledUser] = useState(null);
  const [openUserPopup, setOpenUserPopup] = useState(null); // edit | delete | null
  const [UserErrorMessage, setUserErrorMessage] = useState(null);
  const validateProfile = useValidateProfile();

  // EFFECTS
  useEffect(() => {
    if (initialUser) setHandledUser(initialUser);
  }, [initialUser]);

  // useEffect(() => {
  //   if (!handledUser || openUserPopup !== "edit") return;
  // }, [handledUser]);

  // DELETE mutation
  const { mutate: delete_user, isLoading: isDeletingUser } = useMutation({
    mutationFn: async (id) => {
      const res = await deleteUser(id);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return res;
    },

    onMutate: () => {
      setOpenUserPopup(null);
    },

    onSuccess: async () => {
      setHandledUser(null);
      setUserErrorMessage(null);
      queryClient.invalidateQueries(queryKey);
      if (handledUser.id === currentUser.id) {
        await logout(); // Only logout if explicitly passed
      }
    },

    onError: (err) => {
      console.error(
        "Error with deleting this user.",
        err.response?.data || err.message
      );
    },
  });

  // EDIT mutation
  const { mutate: update_user, isLoading: isUpdatingUser } = useMutation({
    mutationFn: async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await updateUser(data);
      return res;
    },

    onMutate: async (newData) => {
      setOpenUserPopup(null);
      await queryClient.cancelQueries([queryKey]);
      const prevData = queryClient.getQueryData([queryKey]);
      queryClient.setQueryData([queryKey], (prevData) => {
        if (Array.isArray(prevData)) {
          return prevData.map((user) =>
            user.id === newData.id ? newData : user
          );
        } else {
          return { ...prevData, ...newData };
        }
      });
      return { prevData };
    },

    onSuccess: async (newData) => {
      setUserErrorMessage(null);
      await queryClient.invalidateQueries([queryKey]);
      if (newData.id === currentUser.id && queryKey !== "auth") {
        await queryClient.invalidateQueries(["auth"]);
      }
    },

    onError: (err, newData, context) => {
      if (context?.prevData) {
        setHandledUser(context.prevData);
      }

      console.error(
        "Error with updating the user",
        err.response?.data || err.message
      );
    },
  });

  // Action handlers
  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    const nameMap = {
      firstName: "first_name",
      lastName: "last_name",
      phone: "phone",
      birthday: "birthday",
    };
    const key = nameMap[name] || name;

    setHandledUser((prev) => ({
      ...prev,
      [key]: value.trim(),
    }));
  };

  const handleDeleteUser = useCallback(() => {
    if (!handledUser) return;
    delete_user(handledUser.id);
  }, [handledUser, delete_user]);

  const handleUpdateUser = useCallback(() => {
    if (!handledUser) return;
    const data = {
      id: handledUser.id,
      first_name: handledUser.first_name,
      last_name: handledUser.last_name,
      email: handledUser.email,
      phone: handledUser.phone || "",
      birthday: handledUser.birthday || "",
      is_active: true,
      user_type: handledUser.user_type,
    };

    const localErrors = validateUserDataLocally(data);
    if (localErrors) {
      setUserErrorMessage(localErrors);
      return;
    }

    validateProfile.mutate(handledUser, {
      onSuccess: () => {
        setUserErrorMessage(null);
        update_user(data);
      },
      onError: (err) => {
        const error = err.response.data.errors;
        if (error.first_name || error.last_name) {
          setUserErrorMessage({
            type: error.first_name?.[0] ? "first_name" : "last_name",
            message: error.first_name?.[0] || error.last_name?.[0],
          });
        } else if (error.phone) {
          setUserErrorMessage({
            type: "phone",
            message: error.phone[0],
          });
        } else if (error.birthday) {
          setUserErrorMessage({
            type: "birthday",
            message: error.birthday[0],
          });
        }
      },
    });
  }, [handledUser, update_user]);

  return {
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
  };
}
