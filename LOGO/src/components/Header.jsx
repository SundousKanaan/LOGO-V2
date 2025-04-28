import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Text,
  Spacer,
  HStack,
  VStack,
  Avatar,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiMenuAlt3 } from "react-icons/hi";
import { convertPx } from "../hooks/useConvertPx";

import Pathes from "../global/pathes";
import SearchBar from "../components/mini-components/SearchBar";
import HeadingItem from "../components/mini-components/HeadingItem";
import LinkItem from "../components/mini-components/LinkItem";
import ButtonItem from "../components/mini-components/ButtonItem";

export default function Header({ toggleNavbar }) {
  const [pageTitle, setPageTitle] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const currentPath = Pathes.find((path) => path.path === pathname);
    if (pathname.startsWith("/profile/")) {
      setPageTitle("Profile");
    }
    if (currentPath) {
      setPageTitle(currentPath.label);
    }
  }, [pathname]);

  function handleToggleNavbar() {
    toggleNavbar();
  }

  const userName = "John Smith"; // !TODO: change to dynamic value
  const imgSrc = "/src/assets/user.jpg"; // !TODO: change to dynamic value
  const role = "Admin"; // !TODO: change to dynamic value

  return (
    <Flex
      as="header"
      h={{ base: convertPx(110), md: convertPx(50) }}
      pt={{ base: convertPx(10), lg: "0" }}
      flexDirection={{ base: "column", md: "row" }}
      alignItems={{ base: "start", md: "end" }}
      justifyContent="space-between"
      gap={{ base: convertPx(5), md: convertPx(20) }}
    >
      <HStack
        justifyContent="space-between"
        width={{ base: "100%", md: "fit-content" }}
      >
        <HeadingItem fontSize={convertPx(32)} lineHeight={convertPx(24)}>
          {pageTitle}
        </HeadingItem>

        <ButtonItem
          variant={"ghost"}
          width={convertPx(40)}
          display={{ base: "flex", md: "none" }}
          onClick={handleToggleNavbar}
        >
          <HiMenuAlt3 color="secondaryColor" />
        </ButtonItem>
      </HStack>

      <Spacer />

      <Flex
        width={{ base: "100%", md: "50%", lg: "fit-content" }}
        gap={{ base: convertPx(16), lg: convertPx(40) }}
        justifyContent="space-between"
      >
        <SearchBar />

        {/* !TODO: change to dynamic values: img.src & texts */}
        <HStack>
          <Box
            onClick={() => navigate(`/profile/${userName}`, { replace: true })}
            cursor="pointer"
          >
            <Avatar.Root>
              <Avatar.Fallback name={userName} />
              <Avatar.Image src={imgSrc} alt={`${userName} profile photo`} />
            </Avatar.Root>
          </Box>

          <VStack
            width={{ base: "fit-content", md: "fit-content" }}
            align={{ base: "start", sm: "center", md: "start" }}
            gap="0"
            display={{ base: "none", lg: "flex" }}
          >
            <LinkItem
              height="fit-content"
              variant="text"
              to={`/profile/${userName}`}
            >
              <HeadingItem
                fontSize={convertPx(18)}
                lineHeight={convertPx(24)}
                fontWeight="500"
                padding={convertPx(1)}
                whiteSpace="nowrap"
              >
                {userName}
              </HeadingItem>
            </LinkItem>
            <Text
              fontSize={convertPx(14)}
              fontWeight="400"
              opacity="0.5"
              color="secondaryColor"
            >
              {role}
            </Text>
          </VStack>
        </HStack>
      </Flex>
    </Flex>
  );
}
