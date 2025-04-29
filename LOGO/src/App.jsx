import { useState } from "react";
import { Routes, Route, Outlet, Navigate, HashRouter } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { Grid, GridItem } from "@chakra-ui/react";
import { convertPx } from "./hooks/useConvertPx";

import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Pathes from "./global/pathes";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

// Private and Public Route wrappers
function PrivateRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicRoute() {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

// Layout wrapper for the private pages
function PrivateLayouts() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  function toggleNavbar() {
    setIsNavbarOpen(!isNavbarOpen);
  }

  return (
    <Grid
      gridTemplateColumns={{
        base: "1fr",
        md: `${convertPx(220)} 1fr`,
      }}
      gridTemplateRows={{
        base: `100px auto`,
        md: `${convertPx(91)} minmax(calc(100vh - ${convertPx(115)}), 1fr)`,
      }}
      gridTemplateAreas={{
        base: `"header" "page"`,
        md: `
          "navbar header"
          "navbar page"
        `,
      }}
      gap={convertPx(24)}
      bg="lightGray"
      h="100vh"
      overflow="hidden"
      pt={{ base: "20px", md: "0" }}
    >
      <GridItem
        gridArea={{ md: "navbar" }}
        position={{ base: "fixed", md: "static" }}
        top={{ base: convertPx(65), md: "auto" }}
        left={{ base: "0", md: "auto" }}
        bottom={{ base: "0", md: "auto" }}
        right={{ base: "0", md: "auto" }}
        zIndex="9999"
        bg={{ base: "inherit", md: "white" }}
        h={{ base: `calc(100% - ${convertPx(60)})`, md: "100%" }}
        transition="0.3s"
        transform={{
          base: isNavbarOpen ? "scaleY(1)" : "scaleY(0)",
          md: "scaleY(1)",
        }}
        transformOrigin="top"
      >
        <Navbar toggleNavbar={toggleNavbar} />
      </GridItem>
      <GridItem
        gridArea="header"
        alignSelf="end"
        padding={{ base: `0 ${convertPx(10)}`, lg: `0 ${convertPx(48)} 0 0` }}
      >
        <Header toggleNavbar={toggleNavbar} />
      </GridItem>
      <GridItem
        gridArea="page"
        overflowY="auto"
        padding={{
          base: `0 ${convertPx(10)} ${convertPx(20)} ${convertPx(10)}`,
          lg: `${convertPx(24)} ${convertPx(20)} ${convertPx(20)} 0`,
        }}
      >
        {/* This is where the main content will be rendered */}
        <Outlet />
      </GridItem>
    </Grid>
  );
}

// App Function
export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<PrivateLayouts />}>
            {Pathes.map((Path, i) => (
              <Route key={i} path={Path.path} element={<Path.element />} />
            ))}
            <Route path="/profile/:userName" element={<Profile />} />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
