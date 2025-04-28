import { Button } from "@chakra-ui/react";
import { convertPx } from "../../hooks/useConvertPx";

export default function ButtonItem({ children, variant, onClick, ...props }) {
  return (
    <Button
      variant={variant}
      {...props}
      transition={`transform .1s`}
      onClick={onClick}
      _hover={{
        boxShadow: `0 0 0 ${convertPx(2)} var(--chakra-colors-theme-color)`,
      }}
      _active={{
        boxShadow: `0 0 0 ${convertPx(2)} var(--chakra-colors-theme-color)`,
        transform: `scale(${convertPx(0.9)})`,
      }}
      _focus={{
        boxShadow: `0 0 0 ${convertPx(2)} var(--chakra-colors-theme-color)`,
      }}
    >
      {children}
    </Button>
  );
}
