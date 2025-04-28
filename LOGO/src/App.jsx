import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useToggleNavbar } from "./contexts/toggleNavbarContext";
import { useNavigator } from "./contexts/navigatorContext";
import { useAuth } from "./contexts/AuthContext";

import { Grid, GridItem } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Pathes from "./global/pathes";
import Profile from "./pages/Profile";

export default function App() {
  const { currentLocation, navigateTO } = useNavigator();
  const { isNavbarOpen } = useToggleNavbar();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.log("currentLocation", currentLocation);
    console.log("isAuthenticated", isAuthenticated);

    if (!isAuthenticated && currentLocation !== "/login") {
      navigateTO("/login");
    }
  }, [isAuthenticated, currentLocation, navigateTO]);

  return (
    <Grid
      gridTemplateColumns={{
        base: "1fr",
        md: "220px 1fr",
      }}
      gridTemplateRows={{
        base: "125px auto",
        md: "91px minmax(calc(100vh - 115px), 1fr)",
      }}
      gridTemplateAreas={{
        base: `"header" "page"`,
        md: `
            "navbar header"
            "navbar page"
          `,
      }}
      gap="24px"
      bg="lightGray"
      h="100vh"
      overflow="hidden"
    >
      <GridItem
        gridArea={{ md: "navbar" }}
        position={{ base: "fixed", md: "static" }}
        top={{ base: "60px", md: "auto" }}
        left={{ base: "0", md: "auto" }}
        bottom={{ base: "0", md: "auto" }}
        right={{ base: "0", md: "auto" }}
        zIndex="9999"
        bg={{ base: "inherit", md: "white" }}
        h={{ base: "calc(100% - 60px)", md: "100%" }}
        transition="0.3s"
        transform={{
          base: isNavbarOpen ? "scaleY(1)" : "scaleY(0)",
          md: "scaleY(1)",
        }}
        transformOrigin="top"
      >
        <Navbar />
      </GridItem>
      <GridItem
        gridArea="header"
        padding={{ base: "0 10px 0 10px", md: "0 48px 0 0" }}
      >
        <Header />
      </GridItem>
      <GridItem
        gridArea="page"
        mt={{ base: "0", md: "24px" }}
        overflowY="auto"
        padding={{ base: "0 10px 20px 10px", lg: "0 20px 20px 0" }}
      >
        <Routes>
          {Pathes.map((Path, i) => (
            <Route
              key={i}
              index={currentLocation === "/"}
              path={Path.path}
              element={<Path.element />}
            />
          ))}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </GridItem>
    </Grid>
  );
}
