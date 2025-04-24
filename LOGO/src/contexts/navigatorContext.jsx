import { useNavigate, useLocation } from "react-router-dom";
import { createContext, useContext, useState, useEffect } from "react";

const NavigatorContext = createContext();

export const NavigatorProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState("");
  const location = useLocation().pathname;

  useEffect(() => {
    setCurrentLocation(location);
  }, [location]);

  const navigate = useNavigate();

  const navigateTO = (path) => {
    navigate(path, { replace: true });
  };

  return (
    <NavigatorContext.Provider value={{ currentLocation, navigateTO }}>
      {children}
    </NavigatorContext.Provider>
  );
};

export const useNavigator = () => useContext(NavigatorContext);
