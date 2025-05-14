import { Box, HStack, Spacer, List } from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";
import HeadingItem from "../components/mini-components/HeadingItem";
import SellerMiniBox from "../components/mini-components/SellerMiniBox";
import LinkItem from "../components/mini-components/LinkItem";

export default function TopSellers() {
  // TODO:  change this list to the list from the API
  const fakeSellers = [
    {
      name: "Rose Meadows",
      company: "Company name",
      listing: "2464",
      img: "user-placeholder",
    },
    {
      name: "Madden Esparza",
      company: "Company name",
      listing: "6345",
      img: "user-placeholder",
    },
    {
      name: "Edison Norman",
      company: "Company name",
      listing: "9815",
      img: "user-placeholder",
    },
    {
      name: "Terrance Conner",
      company: "Company name",
      listing: "9245",
      img: "user-placeholder",
    },
    {
      name: "Curtis Valentine",
      company: "Company name",
      listing: "2390",
      img: "user-placeholder",
    },
  ];

  return (
    <Box bg="white" layerStyle="dashboardCardsLayout">
      <HStack>
        <HeadingItem
          width="fit-content"
          fontSize={convertPx(18)}
          fontWeight="500"
        >
          Top 5 Fake Sellers
        </HeadingItem>
        <Spacer />
        <LinkItem
          to="/"
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

      <List.Root
        gap={convertPx(18)}
        marginTop={convertPx(16)}
        listStyleType="none"
        overflowY="auto"
        maxH={{
          base: convertPx(337),
          md: convertPx(100),
          lg: "100%",
        }}
        padding={{
          base: `0 ${convertPx(10)}`,
          lg: "0",
        }}
        css={{
          "&::-webkit-scrollbar": {
            width: convertPx(4),
            opacity: "0",
          },
          "&::-webkit-scrollbar-track": {
            width: convertPx(6),
          },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent",
            borderRadius: convertPx(24),
            transition: ".5s",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            background: "themeColor",
          },
        }}
      >
        {fakeSellers.map((seller, index) => (
          <List.Item key={index}>
            <SellerMiniBox
              name={seller.name}
              company={seller.company}
              listing={seller.listing}
              img={seller.img}
            />
          </List.Item>
        ))}
      </List.Root>
    </Box>
  );
}
