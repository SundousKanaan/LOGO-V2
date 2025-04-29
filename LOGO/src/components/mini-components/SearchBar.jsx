import { Input, Box } from "@chakra-ui/react";
import { convertPx } from "../../hooks/useConvertPx";
import { SearchIcon } from "../../global/icons";

export default function SearchBar() {
  return (
    <Box
      width={{
        base: `calc(100% - ${convertPx(60)})`,
        md: `calc(100% - ${convertPx(40)})`,
        xl: convertPx(490),
      }}
      height="inherit"
      position="relative"
    >
      <SearchIcon
        boxSize={convertPx(24)}
        position="absolute"
        top={`calc(50% - ${convertPx(24)} / 2)`}
        right={convertPx(16)}
        zIndex="1"
      />
      <Input
        w="100%"
        h="100%"
        type="search"
        placeholder="Search"
        variant="filled"
        borderRadius={convertPx(8)}
        bg="white"
        _placeholder={{
          color: "secondaryColor",
          opacity: "0.5",
          fontSize: convertPx(16),
        }}
        flexShrink="0"
        _focus={{
          boxShadow: `0 0 0 ${convertPx(2)} var(--chakra-colors-themeColor)`,
        }}
        _hover={{
          boxShadow: `0 0 0 ${convertPx(2)} var(--chakra-colors-themeColor)`,
        }}
      />
    </Box>
  );
}
