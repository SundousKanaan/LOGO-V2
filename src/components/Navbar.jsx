import { useNavigate, useLocation } from "react-router-dom";
import { List, Text, Image, Spacer, Flex } from "@chakra-ui/react";
import { useToggleNavbar } from "../contexts/useToggleNavbar";
import Pathes from "../global/pathes";
import LinkItem from "../mini-components/LinkItem";
import ButtonItem from "../mini-components/ButtonItem";
import HeadingItem from "../mini-components/HeadingItem";

export default function Navbar() {
  const { setIsNavbarOpen } = useToggleNavbar();
  const location = useLocation().pathname;
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/login", { replace: true });
  };
  const handleToggleNavbar = () => {
    setIsNavbarOpen((prev) => !prev);
  };
  return (
    <Flex
      as="nav"
      height={{ base: "calc(100% - 55px)", lg: "100%" }}
      padding={{ base: "15px 20px", lg: "40px 20px" }}
      flexDirection="column"
      justify="start"
      align="start"
      gap="34px"
      bg="white"
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
            bgColor={location === path.path && "themeColor"}
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
              fontWeight={location === path.path ? "600" : "400"}
              paddingLeft="16px"
              color={location === path.path ? "white" : "secondaryColor"}
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
              {location === path.path ? (
                <Image
                  borderRadius="full"
                  boxSize="24px"
                  src={`/src/assets/icons/${path.icon}-active.svg`}
                  alt={`${path.icon} icon`}
                />
              ) : (
                <Image
                  borderRadius="full"
                  boxSize="24px"
                  src={`/src/assets/icons/${path.icon}.svg`}
                  alt={`${path.icon} icon`}
                />
              )}

              {path.label}
            </LinkItem>
          </List.Item>
        ))}
      </List.Root>
      <Spacer display={{ base: "none", lg: "block" }} />
      <ButtonItem
        variant="ghost"
        width={{ base: "fit-content", lg: "100%" }}
        gap="12px"
        onClick={handleLogout}
        _hover={{ bg: "lightGray" }}
      >
        <Image
          borderRadius="full"
          boxSize="24px"
          src="/src/assets/icons/logout.svg"
          alt="log out icon"
        />
        Log out
      </ButtonItem>
    </Flex>
  );
}
