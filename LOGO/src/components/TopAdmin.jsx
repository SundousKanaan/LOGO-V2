import {
  HStack,
  Image,
  Spacer,
  VStack,
  Text,
  Flex,
  Center,
} from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";

import HeadingItem from "../components/mini-components/HeadingItem";
import LinkItem from "../components/mini-components/LinkItem";

export default function TopAdmin({ name, role, noticesReviewed, img, path }) {
  return (
    <Flex
      direction="column"
      justify="space-around"
      layerStyle="dashboardCardsLayout"
      h={convertPx(236)}
    >
      <HStack>
        <HeadingItem
          fontWeight="500"
          fontSize={convertPx(18)}
          color="secondaryColor"
        >
          Top Admin
        </HeadingItem>
        <Spacer />
        <LinkItem
          to="/User-management"
          height="fit-content"
          padding={`${convertPx(5)} ${convertPx(10)}`}
          fontWeight="500"
          fontSize={convertPx(14)}
          color="secondaryColor"
          _hover={{
            boxShadow: `0 0 0 ${convertPx(2)} var(--chakra-colors-themeColor)`,
          }}
        >
          View All
        </LinkItem>
      </HStack>

      <HStack spacing={convertPx(26)}>
        <VStack
          width={convertPx(84)}
          height={convertPx(127)}
          spacing={convertPx(8)}
          flexShrink="0"
        >
          <Image
            src={img}
            alt="Top Admin"
            boxSize={convertPx(84)}
            aspectRatio="1/1"
            objectFit="cover"
            borderRadius="full"
            border={`${convertPx(5)} solid`}
            borderColor="lightGray2"
          />

          <VStack align="center" gap="0">
            <HeadingItem fontSize={convertPx(12)} fontWeight="500">
              {name}
            </HeadingItem>
            <Text fontSize={convertPx(10)} opacity=".5">
              {role}
            </Text>
          </VStack>
        </VStack>

        <VStack width="100%" height={convertPx(114)} spacing={convertPx(12)}>
          <Center
            bg="lightBlue"
            borderRadius={convertPx(12)}
            width="100%"
            height={convertPx(51)}
            gap={convertPx(12)}
          >
            <Text fontSize={convertPx(12)} fontWeight="500" opacity=".5">
              Notices Reviewed:
            </Text>
            <Text fontSize={convertPx(16)} fontWeight="600">
              {noticesReviewed}
            </Text>
          </Center>
          <LinkItem
            to={path}
            width="100%"
            height={convertPx(51)}
            fontWeight="600"
            fontSize={convertPx(16)}
            color="white"
            bg="themeColor"
            display="grid"
            placeItems="center"
            borderRadius={convertPx(12)}
          >
            View Details
          </LinkItem>
        </VStack>
      </HStack>
    </Flex>
  );
}
