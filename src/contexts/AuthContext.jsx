import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "../firebase/authService";
import { setAuthToken } from "../services/api";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useGetUserDetails, postUser } from "../services/users";
import { useQueryClient } from "react-query";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const storedAuthStatus =
    JSON.parse(localStorage.getItem("isAuthenticated")) || false;
  const [isAuthenticated, setIsAuthenticated] = useState(storedAuthStatus);
  const [errorMessage, setErrorMessage] = useState(null);
  const { data: user, isFetched, refetch: refetchUser } = useGetUserDetails();
  const [currentUser, setCurrentUser] = useState(user);
  const queryClient = useQueryClient();

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

  const registerUser = async (data) => {
    const req = {
      method: "POST",
      data: {
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        birthday: data.birthday,
      },
    };

    try {
      await postUser(req);
      login(data.email, data.password);
    } catch (error) {
      console.error("Error registering user:", error);
      setErrorMessage("Registration failed, please try again.");
      return;
    }
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
        registerUser,
        setErrorMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
