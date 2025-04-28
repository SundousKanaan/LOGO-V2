import { List, Text, Spacer, Flex } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

import Pathes from "../global/pathes";
import LinkItem from "../components/mini-components/LinkItem";
import HeadingItem from "../components/mini-components/HeadingItem";
import { LogoutIcon } from "../global/icons";
import { useAuth } from "../contexts/AuthContext";
import ButtonItem from "./mini-components/ButtonItem";
import { convertPx } from "../hooks/useConvertPx";

export default function Navbar({ toggleNavbar }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleToggleNavbar = () => {
    toggleNavbar();
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Flex
      as="nav"
      h="100%"
      p={{
        base: `${convertPx(15)} ${convertPx(20)}`,
        lg: `${convertPx(40)} ${convertPx(20)}`,
      }}
      flexDirection="column"
      justify={{ base: "space-between", md: "start" }}
      align="start"
      gap={{ base: `${convertPx(0)}`, md: `${convertPx(34)}` }}
    >
      <HeadingItem
        as="h1"
        fontFamily="fonts.heading"
        fontWeight="900"
        fontSize={convertPx(32)}
      >
        LOGO
      </HeadingItem>
      <List.Root
        as="ul"
        listStyleType="none"
        padding="0"
        margin="0"
        display="flex "
        flexDirection="column"
        gap={convertPx(16)}
        width={{ base: "100%", lg: `${convertPx(180)}` }}
      >
        {Pathes.map((path, index) => (
          <List.Item
            key={index}
            width="100%"
            height={convertPx(50)}
            borderRadius={convertPx(12)}
            bgColor={pathname === path.path && "themeColor"}
            fontFamily="body"
            position="relative"
          >
            <LinkItem
              variant="button"
              path={path.path}
              display="flex"
              alignItems="center"
              justifyContent="start"
              gap={convertPx(12)}
              fontWeight={pathname === path.path ? "600" : "400"}
              paddingLeft={convertPx(16)}
              color={pathname === path.path ? "white" : "secondaryColor"}
              onClick={handleToggleNavbar}
            >
              {path.path === "/Notifications" && (
                <Text
                  width="fit-content"
                  borderRadius="full"
                  color="white"
                  fontSize={convertPx(12)}
                  fontWeight="600"
                  right={convertPx(5)}
                  bg="infoNotic"
                  lineHeight={convertPx(13.5)}
                  order="2"
                  p={`${convertPx(4)} ${convertPx(6)} ${convertPx(4)} ${convertPx(6)}`}

                >
                  3{/* TODO: make the amunt dynamic */}
                </Text>
              )}
              {
                <path.icon
                  size="lg"
                  color={pathname === path.path ? "white" : "secondaryColor"}
                />
              }
              {path.label}
            </LinkItem>
          </List.Item>
        ))}
      </List.Root>
      <Spacer display={{ base: "none", lg: "block" }} />
      <ButtonItem
        variant="ghost"
        width="100%"
        height={convertPx(50)}
        p={{
          base: `${convertPx(20)} ${convertPx(8)}`,
          lg: `0 ${convertPx(8)}`,
        }}
        justifyContent="start"
        gap={convertPx(12)}
        onClick={handleLogout}
      >
        <LogoutIcon size="lg" />
        Log out
      </ButtonItem>
    </Flex>
  );
}
