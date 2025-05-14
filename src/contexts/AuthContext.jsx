import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const validCredentials = { username: "s", password: "s" };

  const storedAuthStatus =
    JSON.parse(localStorage.getItem("isAuthenticated")) || false;

  const [isAuthenticated, setIsAuthenticated] = useState(storedAuthStatus);
  const [loginMessage, setLoginMessage] = useState(null);
  const [userLoginData, setUserLoginData] = useState({
    name: "",
    password: "",
  });

  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  // Handle login logic
  const login = (name, password) => {
    const isUsernameValid = name === validCredentials.username;
    const isPasswordValid = password === validCredentials.password;

    if (!isUsernameValid && isPasswordValid) {
      setLoginMessage("Invalid username");
      setIsAuthenticated(false);
    } else if (isUsernameValid && !isPasswordValid) {
      setLoginMessage("Invalid password");
      setIsAuthenticated(false);
    } else if (!isUsernameValid && !isPasswordValid) {
      setLoginMessage("Invalid username and password");
      setIsAuthenticated(false);
    } else {
      setUserLoginData({ name, password });
      setLoginMessage("Login successful, Welcome back!");
      setIsAuthenticated(true);

      setTimeout(() => {
        setLoginMessage(null);
      }, 1500);
    }
  };

  // Handle logout logic
  const logout = () => {
    setUserLoginData({ name: "", password: "" });
    setLoginMessage("Logout successful, see you soon!");
    setIsAuthenticated(false);

    localStorage.removeItem("isAuthenticated");

    setTimeout(() => {
      setLoginMessage(null);
    }, 2000);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loginMessage,
        userLoginData,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
