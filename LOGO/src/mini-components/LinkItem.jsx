import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

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
      {...(variant === "button" && {
        borderRadius: "10px",
        _hover: {
          boxShadow:
            "inset 0 0 0 2px var(--chakra-colors-theme-color), 0 5px 7px var(--chakra-colors-light-black)",
          textDecor: "none",
        },
        _focus: {
          boxShadow:
            "inset 0 0 0 2px var(--chakra-colors-theme-color), 0 5px 7px var(--chakra-colors-light-black)",
          outline: "none",
        },
      })}
      {...(variant === "text" && {
        _focus: {
          boxShadow:
            " 0 0 0 2px var(--chakra-colors-theme-color), 0 5px 7px var(--chakra-colors-light-black)",
          outline: "none",
        },
      })}
    >
      {children}
    </ChakraLink>
  );
}
