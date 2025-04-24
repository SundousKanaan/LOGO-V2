import {
  Box,
  ButtonGroup,
  Flex,
  Grid,
  GridItem,
  HStack,
  Spacer,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import ButtonItem from "../mini-components/ButtonItem";
import CountingBox from "../components/CountingBox";
import TopSellers from "../components/TopSellers";
import TopAdmin from "../components/TopAdmin";
import NotifOfTakeDownds from "../components/NotifOfTakeDownds";
import Analytics from "../components/Analytics";

export default function Dashboard() {
  return (
    <>
      <Flex
        width={{ base: "100%", lg: "calc(100% - 24px)" }}
        height={{ base: "fit-content", lg: "45px" }}
        alignItems={{ base: "start", lg: "center" }}
        marginBottom="20px"
        flexDirection={{ base: "column", md: "row" }}
      >
        <Text
          fontWeight="500"
          fontSize="18px"
          color="secondaryColor"
          mb={{ base: "8px", md: "0" }}
        >
          Wed, Oct 27
        </Text>

        <Spacer />

        <HStack spacing="8px">
          <Text
            fontWeight="500"
            fontSize="12px"
            color="secondaryColor"
            opacity="0.6"
          >
            Choose Platform:
          </Text>
          <ButtonGroup variant="solid" spacing="12px">
            <ButtonItem
              bg="white"
              color="secondaryColor"
              padding="9px 21px"
              fontWeight="500"
            >
              Alibaba
            </ButtonItem>
            <ButtonItem
              bg="white"
              color="secondaryColor"
              padding="9px 21px"
              fontWeight="500"
            >
              AliExpress
            </ButtonItem>
            <ButtonItem
              bg="themeColor"
              padding="9px 21px"
              fontWeight="600"
              color="white"
            >
              All
            </ButtonItem>
          </ButtonGroup>
        </HStack>
      </Flex>
      {/* page content */}
      <SimpleGrid
        width={{ base: "100%", lg: "calc(100% - 24px)" }}
        columns={{ base: 1, lg: 3 }}
        gap="24px"
      >
        <GridItem>
          <CountingBox
            title="Numbers of Takedowns"
            counting="478323"
            changeRatio="20.5%"
            icon="chart-square"
            date="October 2023"
          />
        </GridItem>
        <GridItem>
          <CountingBox
            title="% of Goods Scraped"
            counting="92.85%"
            changeRatio="20.5%"
            icon="coin"
            date="October 2023"
          />
        </GridItem>
        <GridItem>
          <CountingBox
            title="New Notices"
            counting="2395"
            icon="message-notif"
            date="October 2023"
            chart={true}
          />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Analytics />
        </GridItem>
        <GridItem>
          <TopSellers />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <NotifOfTakeDownds />
        </GridItem>
        <GridItem>
          {/* // TODO: make the data dynamic */}
          <TopAdmin
            name="Carl Meadows"
            role="Admin"
            noticesReviewed="12,123"
            img="/src/assets/topAdmin.jpg"
            path="/TopSellers"
          />
        </GridItem>
      </SimpleGrid>
    </>
  );
}
