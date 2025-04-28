import { Image, Text, VStack, HStack, Card, Spacer } from "@chakra-ui/react";
import LinkItem from "../components/mini-components/LinkItem";
import HeadingItem from "../components/mini-components/HeadingItem";

function ProductCard({
  viewMode,
  imageSrc,
  title,
  url,
  status,
  viewDetailsLink,
  sourceLink,
}) {
  if (!viewMode) {
    viewMode = "grid";
  }
  return (
    <Card.Root
      layerStyle={
        viewMode === "grid" ? "ProductCardGridLayout" : "ProductCardListLayout"
      }
    >
      <Image
        src={imageSrc}
        alt="Product Image"
        borderRadius={viewMode === "grid" ? "24px" : "8px"}
        boxSize={viewMode === "grid" ? "100%" : "68px"}
        aspectRatio="1/1"
        layerStyle="ProductCardLayout.img"
      />
      <Card.Body
        p="0"
        gap={viewMode === "grid" ? "4" : "24px"}
        flexDir={viewMode === "grid" ? "column" : "row"}
        alignItems={viewMode === "grid" ? "start" : "center"}
        justifyContent={{
          base: viewMode === "grid" ? "start" : "space-between",
          lg: "start",
        }}
      >
        <VStack alignItems={"start"} gap="4px" width="fit-content">
          <HeadingItem fontSize="16px" lineHeight="20px" lineClamp={2}>
            {title}
          </HeadingItem>

          <Text
            fontSize="12px"
            wordBreak="break-all"
            opacity=".6"
            lineClamp={1}
          >
            {url}
          </Text>
        </VStack>

        <Text
          w="fit-content"
          h="fit-content"
          fontSize={{ base: "12px", md: "14px" }}
          fontWeight="500"
          color={
            status === "Removed"
              ? "statusGreen"
              : status === "Reminder Sent"
              ? "statusOrange"
              : "statusRed"
          }
          bg={
            status === "Removed"
              ? "statusGreenLight"
              : status === "Reminder Sent"
              ? "statusOrangeLight"
              : "statusRedLight"
          }
          padding="6px 12px"
          borderRadius="8px"
          position={viewMode === "grid" ? "absolute" : "static"}
          top="28px"
          left="28px"
        >
          {status}
        </Text>
      </Card.Body>

      <Card.Footer
        alignItems={viewMode === "grid" ? "end" : "center"}
        justifyContent="space-between"
        p="0"
        mt="4px"
        width={{
          base: "100%",
          lg: viewMode === "grid" ? "auto" : "fit-content",
        }}
        gap={{ base: "5px", md: viewMode === "grid" ? "0" : "16px" }}
      >
        <LinkItem
          href={viewDetailsLink}
          variant="button"
          color="white"
          fontSize="14px"
          fontWeight="500"
          bg="themeColor"
          padding={viewMode === "grid" ? "6px 12px" : "16px 42px"}
          height={viewMode === "grid" ? "34px" : "54px"}
          borderRadius="8px"
          whiteSpace="nowrap"
        >
          View Details
        </LinkItem>
        <LinkItem
          href={sourceLink}
          variant="button"
          color="white"
          fontSize="14px"
          fontWeight="500"
          bg="secondaryColor"
          padding={viewMode === "grid" ? "6px 12px" : "16px 28.5px"}
          height={viewMode === "grid" ? "34px" : "54px"}
          borderRadius="8px"
          order={viewMode === "grid" ? "0" : "-1"}
          whiteSpace="nowrap"
          visibility={sourceLink ? "visible" : "hidden"}
        >
          Source
        </LinkItem>
      </Card.Footer>
    </Card.Root>
  );
}

export default ProductCard;
