import { useQuery } from "react-query";
import api from "./api";

async function getUsersData() {
  try {
    const response = await api.get("/users/api/");

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export const useUsers = () => {
  return useQuery({
    queryKey: ["dbUsers"],
    queryFn: getUsersData,
    retry: false,
  });
};
