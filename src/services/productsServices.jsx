import { useInfiniteQuery } from "react-query";
import { api } from "./api";
import { useAuth } from "../contexts/AuthContext";

async function getProducts({ pageParam = 1 }) {
  const MAX_PRODUCT_PAGE = 10;
  const response = await api.get(
    `/products/api?page=${pageParam}&limit=${MAX_PRODUCT_PAGE}`
  );
  return response.data;
}

export function useProducts() {
  const { isAuthenticated, isLoading } = useAuth();

  return useInfiniteQuery({
    queryKey: ["products"],
    enabled: isAuthenticated && !isLoading, // Only fetch if authenticated and not loading
    queryFn: getProducts,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
    onError: (error) => {
      console.error("Error fetching products:", error);
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
