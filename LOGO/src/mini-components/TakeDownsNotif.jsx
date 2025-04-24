import { HStack, Text, Spacer, Flex } from "@chakra-ui/react";
import React from "react";
import HeadingItem from "./HeadingItem";

export default function TakeDownsNotif({ title, link, time }) {
  return (
    <Flex width="100%" pb="12px" borderBottom={"solid 1px #F2F2F2"}>
      <HStack spacing="9px">
        <HeadingItem
          fontWeight="400"
          fontSize="14px"
          color="secondaryColor"
          maxWidth={{ base: "150px", md: "300px", lg: "330px" }}
          lineClamp="2"
          lineHeight="20px"
        >
          {title}
        </HeadingItem>
        <Text
          fontWeight="400"
          fontSize="12px"
          color="secondaryColor"
          opacity={"0.6"}
          maxWidth={{ base: "100px", md: "fit-content", lg: "300px" }}
          lineClamp="2"
          isTruncated
        >
          {link}
        </Text>
      </HStack>
      <Spacer />
      <Text
        width="80px"
        fontWeight="400"
        fontSize="12px"
        color="secondaryColor"
        opacity={"0.6"}
        textAlign="end"
        marginLeft={{ base: "auto", lg: "50px" }}
      >
        {time}
      </Text>
    </Flex>
  );
}
