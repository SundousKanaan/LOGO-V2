import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "../firebase/authService";
import { setAuthToken } from "../services/api";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useCurrentUser } from "../hooks/useUserHooks";
import { useMutation, useQueryClient } from "react-query";
import { postUser } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const storedAuthStatus =
    JSON.parse(localStorage.getItem("isAuthenticated")) || false;
  const [isAuthenticated, setIsAuthenticated] = useState(storedAuthStatus);
  const [errorMessage, setErrorMessage] = useState(null);
  const {
    data: user,
    refetch: refetchUser,
    isLoading: isUserLoading,
  } = useCurrentUser();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    if (user) setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const token = await firebaseUser.getIdToken();
        setAuthToken(token);
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", true);
        await refetchUser();
      } catch (error) {
        console.error("Error fetching token:", error);
        setErrorMessage("Failed to fetch user token, please try again.");
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle login logic
  const login = async (email, password) => {
    try {
      await loginUser(email, password);
      setIsAuthenticated(true);
      setTimeout(() => {
        setErrorMessage(null);
      }, 1500);
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.code === "auth/invalid-credential") {
        setErrorMessage("Invalid email or password.");
      } else {
        setErrorMessage("Login failed, please try again later.");
      }
      return;
    }
  };

  // Handle logout logic
  const logout = async () => {
    setErrorMessage("Logout successful, see you soon!");
    setIsAuthenticated(false);

    queryClient.clear();
    localStorage.clear();
    try {
      await logoutUser();
    } catch (error) {
      console.error("Error logging out:", error);
      setErrorMessage("Logout failed, please try again.");
      return;
    }

    setTimeout(() => {
      setErrorMessage(null);
    }, 2500);
  };

  const { mutate: createNewUser, isLoading: isProcessing } = useMutation({
    mutationFn: async (req) => {
      const res = await postUser(req);
      return { ...req, response: res };
    },
    onSuccess: async ({ email, password }) => {
      await loginUser(email, password);
    },
    onError: (err) => {
      console.error("Error registering user:", err);
      if (err.code == "auth/invalid-credential") {
        setErrorMessage({
          message: "Something went wrong. Please try again later.",
        });
      } else {
        setErrorMessage(err.response?.data.errors);
      }
    },
  });

  const signUp = async (data) => {
    const req = {
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      birthday: data.birthday,
    };
    createNewUser(req);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        errorMessage,
        currentUser,
        isLoading: isUserLoading,
        isProcessing,
        login,
        logout,
        signUp,
        setErrorMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
