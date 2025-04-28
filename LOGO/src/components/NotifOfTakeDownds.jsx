import { Flex, HStack, VStack, Spacer } from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";

import HeadingItem from "../components/mini-components/HeadingItem";
import LinkItem from "../components/mini-components/LinkItem";
import TakeDownsNotif from "../components/mini-components/TakeDownsNotif";

export default function NotifOfTakeDownds() {
  // TODO: make the data dynamic from API
  const notifications = [
    {
      title: "Mademoiselle 3.4fl.oz 100 ml perfume, CHANEL",
      link: "https://yourproducturlgoeshere1122.com",
      time: "1 min ago",
    },
    {
      title: "Cigarettes Crush balls Aroma, BLUE ",
      link: "https://yourproducturlgoeshere1122.com",
      time: "2 mins ago",
    },
    {
      title: "Pokémon Enamel Pins Lot you can choose from  ",
      link: "https://yourproducturlgoeshere1122.com",
      time: "2 mins ago",
    },
    {
      title: "4 PCS Herb Tobacco Spice Grinder, COMBAT",
      link: "https://yourproducturlgoeshere1122.com",
      time: "2 mins ago",
    },
    {
      title: "Cigarettes Crush balls Aroma, BLUE ",
      link: "https://yourproducturlgoeshere1122.com",
      time: "6 mins ago",
    },
    {
      title: "Pokémon Enamel Pins Lot you can choose from  ",
      link: "https://yourproducturlgoeshere1122.com",
      time: "6 mins ago",
    },
    {
      title: "4 PCS Herb Tobacco Spice Grinder, COMBAT",
      link: "https://yourproducturlgoeshere1122.com",
      time: "6 mins ago",
    },
    {
      title: "Cigarettes Crush balls Aroma, BLUE ",
      link: "https://yourproducturlgoeshere1122.com",
      time: "6 mins ago",
    },
    {
      title: "Pokémon Enamel Pins Lot you can choose from  ",
      link: "https://yourproducturlgoeshere1122.com",
      time: "6 mins ago",
    },
    {
      title: "4 PCS Herb Tobacco Spice Grinder, COMBAT",
      link: "https://yourproducturlgoeshere1122.com",
      time: "6 mins ago",
    },
    {
      title: "Cigarettes Crush balls Aroma, BLUE ",
      link: "https://yourproducturlgoeshere1122.com",
      time: "6 mins ago",
    },
    {
      title: "Pokémon Enamel Pins Lot you can choose from  ",
      link: "https://yourproducturlgoeshere1122.com",
      time: "6 mins ago",
    },
    {
      title: "4 PCS Herb Tobacco Spice Grinder",
      link: "https://yourproducturlgoeshere1lkllk,slaklsal122.com",
      time: "8 hours ago",
    },
    {
      title:
        "4 PCS Herb Tobacco Spice Grinder 4 PCS Herb Tobacco Spice Grinde 4 PCS Herb Tobacco Spice Grinde",
      link: "https://yourproducturlgoeshere1lkllk,slaklsal122.com",
      time: "8 hours ago",
    },
  ];
  return (
    <Flex
      direction="column"
      layerStyle="dashboardCardsLayout"
      gap={convertPx(20)}
    >
      <HStack justifyContent={"space-between"} width="100%">
        <HeadingItem
          fontWeight="500"
          fontSize={convertPx(18)}
          color="secondaryColor"
        >
          Notifications of Take Downs
        </HeadingItem>
        <Spacer display={{ base: "none", md: "block" }} />
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
      <VStack gap={convertPx(16)} align="start">
        {notifications.map((notification, index) => (
          <TakeDownsNotif
            key={index}
            title={notification.title}
            link={notification.link}
            time={notification.time}
          />
        ))}
      </VStack>
    </Flex>
  );
}
