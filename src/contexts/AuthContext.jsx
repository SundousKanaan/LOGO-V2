import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "../firebase/authService";
import { setAuthToken } from "../services/api";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  useCurrentUserDetails,
  useCreateUser,
} from "../services/usersServices";
import { useQueryClient } from "react-query";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const storedAuthStatus =
    JSON.parse(localStorage.getItem("isAuthenticated")) || false;
  const [isAuthenticated, setIsAuthenticated] = useState(storedAuthStatus);
  const [errorMessage, setErrorMessage] = useState(null);
  const {
    data: user,
    isFetched,
    refetch: refetchUser,
  } = useCurrentUserDetails();
  const [currentUser, setCurrentUser] = useState(user);
  const queryClient = useQueryClient();
  const createUser = useCreateUser();

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
        const res = await refetchUser();
        setCurrentUser(res.data[0]);
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
      setErrorMessage("Login failed, please try again.");
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

  const signUp = async (data) => {
    const req = {
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      birthday: data.birthday,
    };

    createUser.mutate(req, {
      onSuccess: async () => {
        await loginUser(data.email, data.password);
      },
      onError: (err) => {
        console.error("Error registering user:", err);
        setErrorMessage("Registration failed, please try again.");
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        errorMessage,
        currentUser,
        isFetched,
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
