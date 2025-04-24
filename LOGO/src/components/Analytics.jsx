import {
  Box,
  Flex,
  HStack,
  List,
  ListItem,
  Spacer,
  Text,
} from "@chakra-ui/react";
import AnalyticsChart from "../mini-components/AnalyticsChart";

export default function Analytics() {
  return (
    <Box layerStyle="dashboardCardsLayaout">
      <HStack marginBottom="16px">
        <Text fontSize="18px" fontWeight="500" color="secondaryColor">
          Analytics
        </Text>
        <Spacer />
        <Flex gap="23px">
          <HStack>
            <Box
              boxSize={{ base: "10px", md: "12px" }}
              aspectRatio="1"
              bg="#D7F0FC"
              borderRadius="full"
            ></Box>
            <Text
              fontSize={{ base: "10px", md: "12px" }}
              color="secondaryColor"
              fontWeight="600"
            >
              Listings Removed
            </Text>
          </HStack>
          <HStack>
            <Box
              boxSize={{ base: "10px", md: "12px" }}
              aspectRatio="1"
              bg="#CDEFD9"
              borderRadius="full"
            ></Box>
            <Text
              fontSize={{ base: "10px", md: "12px" }}
              color="secondaryColor"
              fontWeight="600"
            >
              Notices Sent
            </Text>
          </HStack>
          <HStack>
            <Box
              boxSize={{ base: "10px", md: "12px" }}
              aspectRatio="1"
              bg="#FEA4A3"
              borderRadius="full"
            ></Box>
            <Text
              fontSize={{ base: "10px", md: "12px" }}
              color="secondaryColor"
              fontWeight="600"
            >
              Notices Rejected
            </Text>
          </HStack>
        </Flex>
      </HStack>

      <AnalyticsChart height="252px" />
    </Box>
  );
}
