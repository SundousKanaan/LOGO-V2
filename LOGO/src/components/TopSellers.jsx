import { Box, HStack, Spacer, List } from "@chakra-ui/react";
import HeadingItem from "../mini-components/HeadingItem";
import ButtonItem from "../mini-components/ButtonItem";
import SellerMiniBox from "../mini-components/SellerMiniBox";
import LinkItem from "../mini-components/LinkItem";

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
    <Box bg="white" layerStyle="dashboardCardsLayaout">
      <HStack>
        <HeadingItem width="fit-content" fontSize="18px" fontWeight="500">
          Top 5 Fake Sellers
        </HeadingItem>
        <Spacer />
        <LinkItem
          to="/"
          height="fit-content"
          padding="5px 10px"
          fontWeight="500"
          fontSize="14px"
          color="secondaryColor"
          _hover={{
            boxShadow: "0 0 0 2px var(--chakra-colors-themeColor)",
          }}
        >
          View All
        </LinkItem>
      </HStack>

      <List.Root
        gap="18px"
        marginTop="16px"
        listStyleType="none"
        overflowY="auto"
        maxH={{ base: "337px", md: "100px", lg: "100%" }}
        padding={{ base: "0 10px", lg: "0" }}
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
            opacity: "0",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent",
            borderRadius: "24px",
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
