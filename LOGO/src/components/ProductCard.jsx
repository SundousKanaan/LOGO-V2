import { Image, Text, VStack, HStack, Card, Spacer } from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";
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
        borderRadius={viewMode === "grid" ? convertPx(24) : convertPx(8)}
        boxSize={viewMode === "grid" ? "100%" : convertPx(68)}
        aspectRatio="1/1"
        layerStyle="ProductCardLayout.img"
      />
      <Card.Body
        p="0"
        gap={viewMode === "grid" ? convertPx(4) : convertPx(24)}
        flexDir={viewMode === "grid" ? "column" : "row"}
        alignItems={viewMode === "grid" ? "start" : "center"}
        justifyContent={{
          base: viewMode === "grid" ? "start" : "space-between",
          lg: "start",
        }}
      >
        <VStack alignItems={"start"} gap={convertPx(4)} width="fit-content">
          <HeadingItem
            fontSize={convertPx(16)}
            lineHeight={convertPx(20)}
            lineClamp={2}
          >
            {title}
          </HeadingItem>

          <Text
            fontSize={convertPx(12)}
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
          fontSize={{ base: convertPx(12), md: convertPx(14) }}
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
          padding={`${convertPx(6)} ${convertPx(12)}`}
          borderRadius={convertPx(8)}
          position={viewMode === "grid" ? "absolute" : "static"}
          top={convertPx(28)}
          left={convertPx(28)}
        >
          {status}
        </Text>
      </Card.Body>

      <Card.Footer
        alignItems={viewMode === "grid" ? "end" : "center"}
        justifyContent={{
          base: viewMode === "grid" ? "space-between" : "end",
          lg: "space-between",
        }}
        p="0"
        mt={convertPx(4)}
        width={{
          base: "100%",
          lg: viewMode === "grid" ? "auto" : "fit-content",
        }}
        gap={viewMode === "grid" ? "0" : convertPx(16)}
      >
        <LinkItem
          href={viewDetailsLink}
          variant="button"
          color="white"
          fontSize={convertPx(14)}
          fontWeight="500"
          bg="themeColor"
          padding={
            viewMode === "grid"
              ? `${convertPx(6)} ${convertPx(12)}`
              : {
                  base: `${convertPx(16)} ${convertPx(12)}`,
                  lg: `${convertPx(16)} ${convertPx(28.5)}`,
                }
          }
          height={
            viewMode === "grid"
              ? convertPx(34)
              : { base: convertPx(40), lg: convertPx(54) }
          }
          borderRadius={convertPx(8)}
          whiteSpace="nowrap"
        >
          View Details
        </LinkItem>
        <LinkItem
          href={sourceLink}
          variant="button"
          color="white"
          fontSize={convertPx(14)}
          fontWeight="500"
          bg="secondaryColor"
          padding={
            viewMode === "grid"
              ? `${convertPx(6)} ${convertPx(12)}`
              : {
                  base: `${convertPx(16)} ${convertPx(12)}`,
                  lg: `${convertPx(16)} ${convertPx(28.5)}`,
                }
          }
          height={
            viewMode === "grid"
              ? convertPx(34)
              : { base: convertPx(40), lg: convertPx(54) }
          }
          borderRadius={convertPx(8)}
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
