import { createContext, useContext, useState } from "react";

const NavbarContext = createContext();

export const NavbarProvider = ({ children }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const toggleNavbar = () => setIsNavbarOpen((prev) => !prev);

  return (
    <NavbarContext.Provider
      value={{ isNavbarOpen, setIsNavbarOpen, toggleNavbar }}
    >
      {children}
    </NavbarContext.Provider>
  );
};

export const useToggleNavbar = () => useContext(NavbarContext);
