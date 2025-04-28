import { List, Text, Spacer, Flex } from "@chakra-ui/react";
import { useToggleNavbar } from "../contexts/toggleNavbarContext";
import { useNavigator } from "../contexts/navigatorContext";
import Pathes from "../global/pathes";
import LinkItem from "../components/mini-components/LinkItem";
import HeadingItem from "../components/mini-components/HeadingItem";
import { LogoutIcon } from "../global/icons";
import { useAuth } from "../contexts/AuthContext";
import ButtonItem from "./mini-components/ButtonItem";

export default function Navbar() {
  const { setIsNavbarOpen } = useToggleNavbar();
  const { currentLocation, navigateTO } = useNavigator();
  const { logout } = useAuth();

  const handleToggleNavbar = () => {
    setIsNavbarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigateTO("/login");
  };

  return (
    <Flex
      as="nav"
      h="100%"
      padding={{ base: "15px 20px", lg: "40px 20px" }}
      flexDirection="column"
      justify={{ base: "space-between", md: "start" }}
      align="start"
      gap={{ base: "0", md: "34px" }}
    >
      <HeadingItem
        as="h1"
        fontFamily="fonts.heading"
        fontWeight="900"
        fontSize="32px"
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
        gap="16px"
        width={{ base: "100%", lg: "180px" }}
      >
        {Pathes.map((path, index) => (
          <List.Item
            key={index}
            width="100%"
            height="50px"
            borderRadius="12px"
            bgColor={currentLocation === path.path && "themeColor"}
            fontFamily="body"
            position="relative"
          >
            <LinkItem
              variant="button"
              path={path.path}
              display="flex"
              alignItems="center"
              justifyContent="start"
              gap="12px"
              fontWeight={currentLocation === path.path ? "600" : "400"}
              paddingLeft="16px"
              color={currentLocation === path.path ? "white" : "secondaryColor"}
              onClick={handleToggleNavbar}
            >
              {path.path === "/Notifications" && (
                <Text
                  width="17px"
                  height="17px"
                  borderRadius="full"
                  color="white"
                  fontSize="12px"
                  fontWeight="600"
                  display="grid"
                  placeItems="center"
                  position="absolute"
                  right="5px"
                  top="calc(50% - 17px / 2)"
                  bg="infoNotic"
                >
                  {/* TODO: make the amunt dynamic */}3
                </Text>
              )}
              {
                <path.icon
                  size="lg"
                  color={
                    currentLocation === path.path ? "white" : "secondaryColor"
                  }
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
        height="50px"
        padding={{ base: "20px 8px", lg: "0 8px" }}
        justifyContent="start"
        gap="12px"
        onClick={handleLogout}
      >
        <LogoutIcon size="lg" />
        Log out
      </ButtonItem>
    </Flex>
  );
}
