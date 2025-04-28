import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { convertPx } from "../../hooks/useConvertPx";

export default function LinkItem({ path, children, variant, ...props }) {
  // when the height is not defined in the parent component, set it to 100% automatically
  // this is to make sure that the link button takes the full height of the parent component
  if (!props.height) {
    props.height = "100%";
  }

  return (
    <ChakraLink
      as={RouterLink}
      to={path}
      fontFamily="body"
      {...props}
      transition="transform .1s"
      {...(variant === "button" && {
        borderRadius: convertPx(10),
        _hover: {
          boxShadow: `inset 0 0 0 ${convertPx(
            2
          )} var(--chakra-colors-theme-color), 0 ${convertPx(5)} ${convertPx(
            7
          )} var(--chakra-colors-light-black)`,
          textDecor: "none",
        },
        _focus: {
          boxShadow: `inset 0 0 0 ${convertPx(
            2
          )} var(--chakra-colors-theme-color), 0 ${convertPx(5)} ${convertPx(
            7
          )} var(--chakra-colors-light-black)`,
          outline: "none",
        },
        _active: {
          transform: "scale(0.9)",
        },
      })}
      {...(variant === "text" && {
        _focus: {
          boxShadow: `0 0 0 ${convertPx(
            2
          )} var(--chakra-colors-theme-color), 0 ${convertPx(5)} ${convertPx(
            7
          )} var(--chakra-colors-light-black)`,
          outline: "none",
        },
      })}
    >
      {children}
    </ChakraLink>
  );
}
