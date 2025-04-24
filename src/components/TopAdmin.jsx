import {
  HStack,
  Image,
  Spacer,
  VStack,
  Text,
  Flex,
  Center,
} from "@chakra-ui/react";
import HeadingItem from "../mini-components/HeadingItem";
import LinkItem from "../mini-components/LinkItem";

export default function TopAdmin({ name, role, noticesReviewed, img, path }) {
  return (
    <Flex
      direction="column"
      justify="space-around"
      layerStyle="dashboardCardsLayaout"
      h="236px"
    >
      <HStack>
        <HeadingItem fontWeight="500" fontSize="18px" color="secondaryColor">
          Top Admin
        </HeadingItem>
        <Spacer />
        <LinkItem
          to="/User-management"
          height="fit-content"
          padding="5px 10px"
          fontWeight="500"
          fontSize="14px"
          color="secondaryColor"
          _hover={{
            boxShadow: "0 0 0 2px var(--chakra-colors-themeColor)",
          }}
        >
          View All
        </LinkItem>
      </HStack>

      <HStack spacing="26px">
        <VStack width="84px" height="127px" spacing="8px" flexShrink="0">
          <Image
            src={img}
            alt="Top Admin"
            boxSize="84px"
            aspectRatio="1/1"
            objectFit="cover"
            borderRadius="full"
            border="5px solid "
            borderColor="lightGray2"
          />

          <VStack align="center" spacing="0">
            <HeadingItem fontSize="12px" fontWeight="500">
              {name}
            </HeadingItem>
            <Text fontSize="10px" opacity=".5">
              {role}
            </Text>
          </VStack>
        </VStack>

        <VStack width="100%" height="114px" spacing="12px">
          <Center
            bg="lightBlue"
            borderRadius="12px"
            width="100%"
            height="51px"
            gap="12px"
          >
            <Text fontSize="12px" fontWeight="500" opacity=".5">
              Notices Reviewed:
            </Text>
            <Text fontSize="16px" fontWeight="600">
              {noticesReviewed}
            </Text>
          </Center>
          <LinkItem
            to={path}
            width="100%"
            height="51px"
            fontWeight="600"
            fontSize="16px"
            color="white"
            bg="themeColor"
            display="grid"
            placeItems="center"
            borderRadius="12px"
            _hover={{
              boxShadow: "0 0 0 2px var(--chakra-colors-themeColor)",
            }}
          >
            View Details
          </LinkItem>
        </VStack>
      </HStack>
    </Flex>
  );
}

// padding="12.5px 20px"
