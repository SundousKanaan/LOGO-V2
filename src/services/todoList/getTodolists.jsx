import { useQuery } from "react-query";
import { useAuth } from "../../contexts/AuthContext";
import api from "../api";

async function getTodolists(data) {
  const userUid = data.id;
  try {
    const response = await api.get(
      `/todos/todo_lists/user_lists/${userUid}/?fields=${data.fields.join(",")}`
    );
    // console.log("API Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
}

export const useTodolists = (fields) => {
  const { currentUser } = useAuth();

  return useQuery({
    queryKey: ["dbTodolists", fields],
    queryFn: () => getTodolists({ id: currentUser?.uid, fields: fields }),
    retry: false,
    enabled: !!currentUser,
  });
};
