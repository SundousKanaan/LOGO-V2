import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "../firebase/authService";
import { setAuthToken, postUser } from "../services/api";
import { getAuth } from "firebase/auth";
import { useCurrentUser } from "../hooks/useUserHooks";
import { useMutation, useQueryClient } from "react-query";
import { Capacitor } from "@capacitor/core";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const storedAuthStatus =
    JSON.parse(localStorage.getItem("isAuthenticated")) || false;

  const [isAuthenticated, setIsAuthenticated] = useState(storedAuthStatus);
  const [errorMessage, setErrorMessage] = useState(null);

  // Hook to fetch the current user from your backend
  const {
    data: user,
    refetch: refetchUser,
    isLoading: isUserLoading,
  } = useCurrentUser();

  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState(user);
  const platform = Capacitor.getPlatform();

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    } else {
      logout();
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      // Perform login (Firebase web or Capacitor behind loginUser)
      await loginUser(email, password);
      setIsAuthenticated(true);

      // Fetch token right after login
      let token;
      if (platform === "android" || platform === "ios") {
        // FirebaseAuthentication is a Capacitor plugin
        const { FirebaseAuthentication } = await import(
          "@capacitor-firebase/authentication"
        );

        const { token: idToken } = await FirebaseAuthentication.getIdToken();
        token = idToken;
      } else {
        const auth = getAuth();
        const firebaseUser = auth.currentUser;
        token = await firebaseUser.getIdToken();
      }

      // Save token in axios & localStorage
      setAuthToken(token);
      localStorage.setItem("isAuthenticated", true);

      // Immediately refetch user profile from backend
      await refetchUser();

      setTimeout(() => setErrorMessage(null), 1500);
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.code === "auth/invalid-credential") {
        setErrorMessage("Invalid email or password.");
      } else {
        setErrorMessage("Login failed, please try again later.");
      }
    }
  };

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

    setTimeout(() => setErrorMessage(null), 2500);
  };

  const { mutate: createNewUser, isLoading: isProcessing } = useMutation({
    mutationFn: async (req) => {
      const res = await postUser(req);
      return { ...req, response: res };
    },
    onSuccess: async ({ email, password }) => {
      await login(email, password);
    },
    onError: (err) => {
      console.error("Error registering user:", err);
      if (err.code === "auth/invalid-credential") {
        setErrorMessage("Something went wrong. Please try again later.");
      } else {
        setErrorMessage(err.response?.data.errors);
      }
    },
  });

  const signUp = (data) => {
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
        refetchUser,
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
