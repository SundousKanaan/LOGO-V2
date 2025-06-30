import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "../firebase/authService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setAuthToken } from "../services/api";
import { useGetAllUsers, postUser } from "../services/users";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const { data: dbUsers, isLoading, isFetched } = useGetAllUsers();
  const [userToken, setUserToken] = useState(null);
  const storedAuthStatus =
    JSON.parse(localStorage.getItem("isAuthenticated")) || false;
  const [isAuthenticated, setIsAuthenticated] = useState(storedAuthStatus);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (isLoading) return;

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const matchedUser = dbUsers?.find(
          (dbUser) => dbUser.firebase_uid === user.uid
        );
        const userData = {
          uid: user.uid,
          email: user.email,
          first_name: matchedUser?.first_name,
          last_name: matchedUser?.last_name,
          photo: matchedUser?.photoURL,
          user_type: matchedUser?.user_type,
          phone: matchedUser?.phone,
          birthday: matchedUser?.birthday,
        };
        setCurrentUser(userData);

        const token = await user.getIdToken();
        setUserToken(token);
        setAuthToken(token); // set the token in the header

        localStorage.setItem("isAuthenticated", true);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    });

    return () => unsubscribe();
  }, [dbUsers, isLoading]);

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
        isLoading,
        isFetched,
        userToken,
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
