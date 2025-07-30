"use client";

import { ColorModeProvider } from "./color-mode";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "../../global/theme";
import { Box } from "@chakra-ui/react";

export function ThemeProvider(props) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
