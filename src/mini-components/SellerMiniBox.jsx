import {
  Box,
  Image,
  VStack,
  Text,
  HStack,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import HeadingItem from "./HeadingItem";

export default function SellerMiniBox({ name, company, listing, img }) {
  if (!img || img === "") {
    img = "user-placeholder";
  }

  return (
    <Flex align="center">
      <HStack align="center">
        <Image
          src={`/src/assets/${img}.svg`}
          alt="seller"
          boxSize="36px"
          objectFit="cover"
          borderRadius="10px"
        />
        <VStack align="start" spacing="0" gap="0">
          <HeadingItem fontSize="12px" fontWeight="500" lineHeight="12px">
            {name}
          </HeadingItem>
          <Text fontSize="10px" opacity=".5">
            {company}
          </Text>
        </VStack>
      </HStack>

      <Spacer />

      <Text fontSize="14px" fontWeight="500" opacity=".5">
        Listing #{listing}
      </Text>
    </Flex>
  );
}
