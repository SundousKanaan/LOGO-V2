import { useNavigate, useLocation } from "react-router-dom";
import { createContext, useContext, useState, useEffect } from "react";

const NavigatorContext = createContext();

export const NavigatorProvider = ({ children }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [currentLocation, setCurrentLocation] = useState(pathname);

  useEffect(() => {
    setCurrentLocation(pathname);
  }, [pathname]);

  const navigateTO = (path) => {
    navigate(path, { replace: true });
    setCurrentLocation(path);
  };

  return (
    <NavigatorContext.Provider value={{ currentLocation, navigateTO }}>
      {children}
    </NavigatorContext.Provider>
  );
};

export const useNavigator = () => useContext(NavigatorContext);
