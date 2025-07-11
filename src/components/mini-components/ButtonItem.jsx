import { Button } from "@chakra-ui/react";
import { convertPx } from "../../hooks/useConvertPx";

export default function ButtonItem({
  children,
  variant,
  onClick,
  isDisabled = false,
  ...props
}) {
  return (
    <Button
      variant={variant}
      transition={`transform .1s`}
      onClick={onClick}
      disabled={isDisabled}
      _hover={{
        boxShadow: `0 0 0 ${convertPx(1)} var(--chakra-colors-theme-color)`,
      }}
      _active={{
        boxShadow: `0 0 0 ${convertPx(2)} var(--chakra-colors-theme-color)`,
        transform: `scale(.9)`,
      }}
      _focus={{
        boxShadow: `0 0 0 ${convertPx(1)} var(--chakra-colors-theme-color)`,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
