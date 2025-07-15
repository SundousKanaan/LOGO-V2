import { useInfiniteQuery } from "react-query";
import { fetchProducts } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export function useProducts() {
  const { isAuthenticated, isLoading } = useAuth();

  return useInfiniteQuery({
    queryKey: ["products"],
    enabled: isAuthenticated && !isLoading, // Only fetch if authenticated and not loading
    queryFn: fetchProducts,
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
