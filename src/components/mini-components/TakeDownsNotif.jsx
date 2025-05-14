import { HStack, Text, Spacer, Flex } from "@chakra-ui/react";
import { convertPx } from "../../hooks/useConvertPx";

import React from "react";
import HeadingItem from "./HeadingItem";

export default function TakeDownsNotif({ title, link, time }) {
  return (
    <Flex
      width="100%"
      pb={convertPx(12)}
      borderBottom={`solid ${convertPx(1)} #F2F2F2`}
    >
      <HStack spacing={convertPx(9)}>
        <HeadingItem
          fontWeight="400"
          fontSize={convertPx(14)}
          color="secondaryColor"
          maxWidth={{
            base: convertPx(150),
            md: convertPx(300),
            lg: convertPx(330),
          }}
          lineClamp="2"
          lineHeight={convertPx(20)}
        >
          {title}
        </HeadingItem>
        <Text
          fontWeight="400"
          fontSize={convertPx(12)}
          color="secondaryColor"
          opacity={"0.6"}
          maxWidth={{
            base: convertPx(100),
            md: "fit-content",
            lg: convertPx(300),
          }}
          lineClamp="2"
          isTruncated
        >
          {link}
        </Text>
      </HStack>
      <Spacer />
      <Text
        width={convertPx(80)}
        fontWeight="400"
        fontSize={convertPx(12)}
        color="secondaryColor"
        opacity={"0.6"}
        textAlign="end"
        marginLeft={{
          base: "auto",
          lg: convertPx(50),
        }}
      >
        {time}
      </Text>
    </Flex>
  );
}
