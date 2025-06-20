import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Text,
  Spacer,
  HStack,
  VStack,
  Avatar,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiMenuAlt2 } from "react-icons/hi";
import { convertPx } from "../hooks/useConvertPx";
import { useAuth } from "../contexts/AuthContext";
import { UsePickRandomColor } from "../hooks/usePickRandomColor";

import Pathes from "../global/pathes";
import SearchBar from "../components/mini-components/SearchBar";
import HeadingItem from "../components/mini-components/HeadingItem";
import LinkItem from "../components/mini-components/LinkItem";
import ButtonItem from "../components/mini-components/ButtonItem";

export default function Header({ toggleNavbar }) {
  const [pageTitle, setPageTitle] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { currentUser, isLoading } = useAuth();

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

  return (
    <Flex
      as="header"
      width="100%"
      h={{ base: convertPx(110), md: convertPx(50) }}
      pt={{ base: convertPx(16), lg: "0" }}
      flexDirection={{ base: "column", md: "row" }}
      justifyContent="space-between"
      gap={{ base: convertPx(5), md: convertPx(20) }}
      position="relative"
    >
      <HStack
        justifyContent="space-between"
        width={{ base: "100%", md: "fit-content" }}
      >
        <ButtonItem
          variant={"solid"}
          minWidth={convertPx(45)}
          h={convertPx(45)}
          px="0"
          position="absolute"
          display={{ base: "flex", md: "none" }}
          color="secondaryColor"
          bg="white"
          borderRadius={convertPx(8)}
          onClick={handleToggleNavbar}
        >
          <HiMenuAlt2 color="secondaryColor" />
        </ButtonItem>
        <HeadingItem
          fontSize={convertPx(32)}
          width={{ base: "100%", md: "fit-content" }}
          textAlign={{ base: "center", md: "start" }}
        >
          {pageTitle}
        </HeadingItem>
      </HStack>

      <Spacer />

      <Flex
        h={{ base: "100%", lg: "inherit" }}
        width={{ base: "100%", md: "70%", xl: "fit-content" }}
        gap={{ base: convertPx(16), lg: convertPx(40) }}
        justifyContent="space-between"
      >
        <SearchBar />

        <HStack>
          <SkeletonCircle loading={isLoading}>
            <Box
              onClick={() =>
                navigate(`/profile/${currentUser?.displayName}`, {
                  replace: true,
                })
              }
              cursor="pointer"
            >
              <Avatar.Root
                colorPalette={UsePickRandomColor(currentUser?.firstName)}
              >
                <Avatar.Fallback />
                <Avatar.Image
                  src={currentUser?.photo}
                  alt={`${currentUser?.displayName} profile photo`}
                />
              </Avatar.Root>
            </Box>
          </SkeletonCircle>

          <VStack
            width={{ base: "fit-content", md: "fit-content" }}
            align={{ base: "start", sm: "center", md: "start" }}
            gap="0"
            display={{ base: "none", lg: "flex" }}
          >
            <Skeleton
              loading={isLoading}
              width={convertPx(100)}
              height={convertPx(20)}
              mb={convertPx(4)}
            >
              <LinkItem
                height="fit-content"
                variant="text"
                to={`/profile/${currentUser?.displayName}`}
              >
                <HeadingItem
                  fontSize={convertPx(18)}
                  lineHeight={convertPx(16)}
                  fontWeight="500"
                  padding={convertPx(1)}
                  whiteSpace="nowrap"
                  textTransform="capitalize"
                >
                  {currentUser?.displayName}
                </HeadingItem>
              </LinkItem>
            </Skeleton>

            <Skeleton loading={isLoading} width={convertPx(50)}>
              <Text
                fontSize={convertPx(14)}
                fontWeight="400"
                opacity="0.5"
                color="secondaryColor"
                textTransform="capitalize"
                lineHeight={convertPx(16)}
              >
                {currentUser?.role}
              </Text>
            </Skeleton>
          </VStack>
        </HStack>
      </Flex>
    </Flex>
  );
}
