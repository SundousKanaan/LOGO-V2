import { Box, Flex, HStack, Spacer, Text } from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";

import AnalyticsChart from "../components/mini-components/AnalyticsChart";

export default function Analytics() {
  return (
    <Box layerStyle="dashboardCardsLayout">
      <HStack marginBottom={convertPx(16)}>
        <Text fontSize={convertPx(18)} fontWeight="500" color="secondaryColor">
          Analytics
        </Text>
        <Spacer />
        <Flex gap={convertPx(23)}>
          <HStack>
            <Box
              boxSize={{ base: convertPx(10), md: convertPx(12) }}
              aspectRatio="1"
              bg="#D7F0FC"
              borderRadius="full"
            ></Box>
            <Text
              fontSize={{ base: convertPx(10), md: convertPx(12) }}
              color="secondaryColor"
              fontWeight="600"
            >
              Listings Removed
            </Text>
          </HStack>
          <HStack>
            <Box
              boxSize={{ base: convertPx(10), md: convertPx(12) }}
              aspectRatio="1"
              bg="#CDEFD9"
              borderRadius="full"
            ></Box>
            <Text
              fontSize={{ base: convertPx(10), md: convertPx(12) }}
              color="secondaryColor"
              fontWeight="600"
            >
              Notices Sent
            </Text>
          </HStack>
          <HStack>
            <Box
              boxSize={{ base: convertPx(10), md: convertPx(12) }}
              aspectRatio="1"
              bg="#FEA4A3"
              borderRadius="full"
            ></Box>
            <Text
              fontSize={{ base: convertPx(10), md: convertPx(12) }}
              color="secondaryColor"
              fontWeight="600"
            >
              Notices Rejected
            </Text>
          </HStack>
        </Flex>
      </HStack>

      <AnalyticsChart height={convertPx(252)} />
    </Box>
  );
}
