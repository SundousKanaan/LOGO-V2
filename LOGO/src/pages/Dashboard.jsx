import {
  ButtonGroup,
  Flex,
  GridItem,
  HStack,
  Spacer,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";

import ButtonItem from "../components/mini-components/ButtonItem";
import CountingCard from "../components/CountingCard";
import TopSellers from "../components/TopSellers";
import TopAdmin from "../components/TopAdmin";
import NotifOfTakeDownds from "../components/NotifOfTakeDownds";
import Analytics from "../components/Analytics";
import { ChartIcon, CoinIcon, NotificationMessageIcon } from "../global/icons";

export default function Dashboard() {
  return (
    <>
      <Flex
        height={{ base: "fit-content", lg: convertPx(45) }}
        alignItems={{ base: "start", lg: "center" }}
        marginBottom={convertPx(20)}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Text
          fontWeight="500"
          fontSize={convertPx(18)}
          color="secondaryColor"
          mb={{ base: convertPx(8), md: "0" }}
        >
          Wed, Oct 27
        </Text>

        <Spacer />

        <HStack
          spacing={convertPx(8)}
          width={{ base: "fit-content", sm: "100%", md: "fit-content" }}
          justifyContent="space-between"
          flexWrap="wrap"
          gap={convertPx(8)}
        >
          <Text
            fontWeight="500"
            fontSize={convertPx(12)}
            color="secondaryColor"
            opacity="0.6"
          >
            Choose Platform:
          </Text>
          <ButtonGroup variant="solid" spacing={convertPx(12)}>
            <ButtonItem
              bg="white"
              color="secondaryColor"
              padding={`${convertPx(9)} ${convertPx(21)}`}
              fontWeight="500"
            >
              Alibaba
            </ButtonItem>
            <ButtonItem
              bg="white"
              color="secondaryColor"
              padding={`${convertPx(9)} ${convertPx(21)}`}
              fontWeight="500"
            >
              AliExpress
            </ButtonItem>
            <ButtonItem
              bg="themeColor"
              padding={`${convertPx(9)} ${convertPx(21)}`}
              fontWeight="600"
              color="white"
            >
              All
            </ButtonItem>
          </ButtonGroup>
        </HStack>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} gap={convertPx(24)}>
        <GridItem>
          <CountingCard
            title="Numbers of Takedowns"
            counting="478323"
            changeRatio="20.5%"
            icon={ChartIcon}
            date="October 2023"
          />
        </GridItem>
        <GridItem>
          <CountingCard
            title="% of Goods Scraped"
            counting="92.85%"
            changeRatio="20.5%"
            icon={CoinIcon}
            date="October 2023"
          />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2, xl: 1 }}>
          <CountingCard
            title="New Notices"
            counting="2395"
            icon={NotificationMessageIcon}
            date="October 2023"
            chart={true}
          />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Analytics />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2, xl: 1 }}>
          <TopSellers />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <NotifOfTakeDownds />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2, xl: 1 }}>
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
