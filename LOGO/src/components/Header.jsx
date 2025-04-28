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
      height="100%"
      pt={{ base: "10px", lg: "0" }}
      flexDirection={{ base: "column", md: "row" }}
      alignItems={{ base: "start", md: "end" }}
      justifyContent="space-between"
      gap={{ base: "5px", md: "20px" }}
    >
      <HStack
        justifyContent="space-between"
        width={{ base: "100%", md: "fit-content" }}
      >
        <HeadingItem fontSize="32px" lineHeight="50px">
          {pageTitle}
        </HeadingItem>

        <ButtonItem
          variant={"ghost"}
          width="40px"
          display={{ base: "flex", md: "none" }}
          onClick={handleToggleNavbar}
        >
          <HiMenuAlt3 color="secondaryColor" />
        </ButtonItem>
      </HStack>

      <Spacer />

      <Flex
        width={{ base: "100%", md: "50%", lg: "fit-content" }}
        gap={{ base: "16px", lg: "40px" }}
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
                fontSize="18px"
                lineHeight="24px"
                fontWeight="500"
                padding="1px"
                whiteSpace="nowrap"
              >
                {userName}
              </HeadingItem>
            </LinkItem>
            <Text
              fontSize="14px"
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
