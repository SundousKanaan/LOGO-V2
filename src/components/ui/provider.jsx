"use client";

// import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
// import { ColorModeProvider } from "./color-mode";

// export function Provider(props) {
//   return (
//     <ChakraProvider value={defaultSystem}>
//       <ColorModeProvider {...props} />
//     </ChakraProvider>
//   );
// }

import { ColorModeProvider } from "./color-mode";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "../../global/theme";

export function Provider(props) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
