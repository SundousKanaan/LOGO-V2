import { Button } from "@chakra-ui/react";
import React from "react";

export default function ButtonItem({ children, variant, onClick, ...props }) {
  return (
    <Button
      variant={variant}
      {...props}
      transition="transform .5s"
      onClick={onClick}
      _hover={{ boxShadow: "0 0 0 2px var(--chakra-colors-themeColor)" }}
      _active={{
        boxShadow: "0 0 0 2px var(--chakra-colors-themeColor)",
        transform: "scale(0.9)",
      }}
      _focus={{ boxShadow: "0 0 0 2px var(--chakra-colors-themeColor)" }}
    >
      {children}
    </Button>
  );
}
