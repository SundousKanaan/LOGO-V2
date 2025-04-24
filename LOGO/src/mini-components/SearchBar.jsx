import { Input } from "@chakra-ui/react";

export default function SearchBar() {
  return (
    <Input
      type="search"
      placeholder="Search"
      variant="filled"
      width={{
        base: "calc(100% - 70px)",
        // md: "auto",
        lg: "400px",
      }}
      height="50px"
      borderRadius="8px"
      bg="white"
      _placeholder={{
        color: "secondaryColor",
        opacity: "0.5",
        fontSize: "16px",
      }}
      flexShrink="0"
      _focus={{ boxShadow: "0 0 0 2px var(--chakra-colors-themeColor)" }}
      _hover={{ boxShadow: "0 0 0 2px var(--chakra-colors-themeColor)" }}
      sx={{
        backgroundImage: "url('/src/assets/icons/search.svg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 16px center",
        backgroundSize: "24px 24px",
      }}
    />
  );
}
