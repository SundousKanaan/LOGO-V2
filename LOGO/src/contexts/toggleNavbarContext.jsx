import { createContext, useContext, useState, useCallback } from "react";

const NavbarContext = createContext();

export const NavbarProvider = ({ children }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = useCallback(() => {
    setIsNavbarOpen((prev) => !prev);
  }, []);

  return (
    <NavbarContext.Provider value={{ isNavbarOpen, toggleNavbar }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useToggleNavbar = () => useContext(NavbarContext);
