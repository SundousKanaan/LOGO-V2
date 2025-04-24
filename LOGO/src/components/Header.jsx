import { useLocation } from "react-router-dom";
import { Flex, Image, Text, Spacer, HStack, VStack } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useToggleNavbar } from "../contexts/useToggleNavbar";
import Pathes from "../global/pathes";
import SearchBar from "../mini-components/SearchBar";
import HeadingItem from "../mini-components/HeadingItem";
import LinkItem from "../mini-components/LinkItem";
import ButtonItem from "../mini-components/ButtonItem";

export default function Header() {
  const { toggleNavbar } = useToggleNavbar();

  const userName = "John Smith"; // !TODO: change to dynamic value
  const imgSrc = "/src/assets/user.jpg"; // !TODO: change to dynamic value
  const role = "Admin"; // !TODO: change to dynamic value
  const location = useLocation();
  let pageTitle = "";
  Pathes.filter((Path) => {
    if (Path.path === location.pathname) {
      pageTitle = Path.label;
    }
  });

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
          onClick={toggleNavbar}
        >
          <Icon color="secondaryColor">
            <HiOutlineMenuAlt3 />
          </Icon>
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
          <Image
            borderRadius="full"
            boxSize="40px"
            objectFit="cover"
            src={imgSrc}
            alt={`${userName} profile photo`}
          />

          <VStack
            width={{ base: "fit-content", md: "fit-content" }}
            align={{ base: "start", sm: "center", md: "start" }}
            gap="0"
            display={{ base: "none", lg: "flex" }}
          >
            <LinkItem height="fit-content" variant="text" to={`/${userName}`}>
              <HeadingItem
                fontSize="18px"
                lineHeight="24px"
                fontWeight="500"
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
