import { forwardRef } from "react";
import { Image, Text, VStack, Card } from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";
import LinkItem from "../components/mini-components/LinkItem";
import HeadingItem from "../components/mini-components/HeadingItem";

const ProductCard = forwardRef(({ data, viewMode }, ref) => {
  if (!viewMode) {
    viewMode = "grid";
  }

  const isGridMode = viewMode === "grid";

  return (
    <Card.Root
      ref={ref}
      layerStyle={
        isGridMode ? "ProductCardGridLayout" : "ProductCardListLayout"
      }
    >
      <Image
        src={data?.image_src || "src/assets/product-placeholder.png"}
        alt="Product Image"
        borderRadius={isGridMode ? convertPx(24) : convertPx(8)}
        boxSize={isGridMode ? "100%" : convertPx(68)}
        aspectRatio="1/1"
        layerStyle="ProductCardLayout.img"
        loading="lazy"
      />
      <Card.Body
        p="0"
        gap={isGridMode ? convertPx(4) : convertPx(24)}
        flexDir={isGridMode ? "column" : "row"}
        alignItems={isGridMode ? "start" : "center"}
        justifyContent={{
          base: isGridMode ? "start" : "space-between",
          lg: "start",
        }}
      >
        <VStack alignItems={"start"} gap={convertPx(4)} width="fit-content">
          <HeadingItem
            fontSize={convertPx(16)}
            lineHeight={convertPx(20)}
            lineClamp={2}
          >
            {data?.title}
          </HeadingItem>

          <Text
            fontSize={convertPx(12)}
            wordBreak="break-all"
            opacity=".6"
            lineClamp={1}
          >
            {data?.video_url}
          </Text>
        </VStack>

        <Text
          w="fit-content"
          h="fit-content"
          fontSize={{ base: convertPx(12), md: convertPx(14) }}
          fontWeight="500"
          textTransform={"capitalize"}
          color={
            data?.status === "removed"
              ? "statusRed"
              : data?.status === "reminder sent"
              ? "statusOrange"
              : "statusGreen"
          }
          bg={
            data?.status === "removed"
              ? "statusRedLight"
              : data?.status === "reminder sent"
              ? "statusOrangeLight"
              : "statusGreenLight"
          }
          padding={`${convertPx(6)} ${convertPx(12)}`}
          borderRadius={convertPx(8)}
          position={isGridMode ? "absolute" : "static"}
          top={convertPx(28)}
          left={convertPx(28)}
        >
          {data?.status}
        </Text>
      </Card.Body>

      <Card.Footer
        alignItems={isGridMode ? "end" : "center"}
        justifyContent={{
          base: isGridMode ? "space-between" : "end",
          lg: "space-between",
        }}
        p="0"
        mt={convertPx(4)}
        width={{
          base: "100%",
          lg: isGridMode ? "auto" : "fit-content",
        }}
        gap={isGridMode ? "0" : convertPx(16)}
      >
        <LinkItem
          path={"#"}
          target="_blank"
          variant="button"
          color="white"
          fontSize={convertPx(14)}
          fontWeight="500"
          bg="themeColor"
          padding={
            isGridMode
              ? `${convertPx(6)} ${convertPx(12)}`
              : {
                  base: `${convertPx(16)} ${convertPx(12)}`,
                  lg: `${convertPx(16)} ${convertPx(28.5)}`,
                }
          }
          height={
            isGridMode
              ? convertPx(34)
              : { base: convertPx(40), lg: convertPx(54) }
          }
          borderRadius={convertPx(8)}
          whiteSpace="nowrap"
        >
          View Details
        </LinkItem>
        <LinkItem
          href={data?.source}
          variant="button"
          color="white"
          fontSize={convertPx(14)}
          fontWeight="500"
          bg="secondaryColor"
          padding={
            isGridMode
              ? `${convertPx(6)} ${convertPx(12)}`
              : {
                  base: `${convertPx(16)} ${convertPx(12)}`,
                  lg: `${convertPx(16)} ${convertPx(28.5)}`,
                }
          }
          height={
            isGridMode
              ? convertPx(34)
              : { base: convertPx(40), lg: convertPx(54) }
          }
          borderRadius={convertPx(8)}
          order={isGridMode ? "0" : "-1"}
          whiteSpace="nowrap"
          visibility={data?.source ? "visible" : "hidden"}
        >
          Source
        </LinkItem>
      </Card.Footer>
    </Card.Root>
  );
});

export default ProductCard;
