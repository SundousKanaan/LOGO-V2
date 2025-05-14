import {
  Box,
  Image,
  VStack,
  Text,
  HStack,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { convertPx } from "../../hooks/useConvertPx";

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
          boxSize={convertPx(36)}
          objectFit="cover"
          borderRadius={convertPx(10)}
        />
        <VStack align="start" spacing={convertPx(0)} gap={convertPx(0)}>
          <HeadingItem
            fontSize={convertPx(12)}
            fontWeight="500"
            lineHeight={convertPx(12)}
          >
            {name}
          </HeadingItem>
          <Text fontSize={convertPx(10)} opacity=".5">
            {company}
          </Text>
        </VStack>
      </HStack>

      <Spacer />

      <Text fontSize={convertPx(14)} fontWeight="500" opacity=".5">
        Listing #{listing}
      </Text>
    </Flex>
  );
}
