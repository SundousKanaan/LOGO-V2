// import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useToggleNavbar } from "./contexts/useToggleNavbar";

import { Grid, GridItem } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Pathes from "./global/pathes";

export default function App() {
  const location = useLocation().pathname;
  const { isNavbarOpen } = useToggleNavbar();

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
      gap={{ base: "10px", xl: "24px" }}
      bg="lightGray"
      h="100vh"
      overflow="hidden"
    >
      <GridItem
        gridArea={{ md: "navbar" }}
        position={{ base: "fixed", md: "static" }}
        top={{ base: "55px", md: "auto" }}
        left={{ base: "0", md: "auto" }}
        bottom={{ base: "0", md: "auto" }}
        right={{ base: "0", md: "auto" }}
        zIndex="9999"
        bg="white"
        transition="0.3s"
        transform={{
          base: isNavbarOpen ? "scaleY(0)" : "scaleY(1)",
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
        overflowY="auto"
        padding={{
          base: "0 10px 20px 10px",
          lg: "0 10px 20px 0",
          xl: "0 24px 20px 0",
        }}
      >
        <Routes>
          {Pathes.map((Path, i) => (
            <Route
              key={i}
              index={location === "/"}
              path={Path.path}
              element={<Path.element />}
            />
          ))}
        </Routes>
      </GridItem>
    </Grid>
  );
}
