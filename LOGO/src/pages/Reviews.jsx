import { useState } from "react";
import { Flex, Spacer, HStack, ButtonGroup, Text, Box } from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";

import ProductCard from "../components/ProductCard";
import ButtonItem from "../components/mini-components/ButtonItem";

export default function Reviews() {
  const [viewMode, setViewMode] = useState("grid");

  const handleViewModeChange = (mode) => {
    console.log("View mode changed to:", mode);

    setViewMode(mode);
  };

  return (
    <>
      <Flex
        height={{ base: "fit-content", lg: convertPx(45) }}
        alignItems={{ base: "start", lg: "center" }}
        marginBottom={convertPx(24)}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Text
          fontSize={convertPx(18)}
          fontWeight="500"
          color="secondaryColor"
          mb={{ base: convertPx(8), md: "0" }}
        >
          Product List
        </Text>

        <Spacer />

        <HStack
          spacing={convertPx(8)}
          width={{ base: "fit-content", sm: "100%", md: "fit-content" }}
          justifyContent="space-between"
        >
          <ButtonGroup variant="solid" spacing={convertPx(12)}>
            <ButtonItem
              bg={viewMode === "grid" ? "secondaryColor" : "white"}
              color={viewMode === "grid" ? "white" : "secondaryColor"}
              padding={`${convertPx(9)} ${convertPx(21)}`}
              borderRadius={convertPx(10)}
              onClick={() => handleViewModeChange("grid")}
            >
              Grid View
            </ButtonItem>

            <ButtonItem
              bg={viewMode === "list" ? "secondaryColor" : "white"}
              color={viewMode === "list" ? "white" : "secondaryColor"}
              padding={`${convertPx(9)} ${convertPx(21)}`}
              borderRadius={convertPx(10)}
              onClick={() => handleViewModeChange("list")}
            >
              List View
            </ButtonItem>
          </ButtonGroup>
        </HStack>
      </Flex>

      <Box
        layerStyle={
          viewMode === "grid"
            ? "ProductCardsListGridLayout"
            : "ProductCardsListLayout"
        }
      >
        <ProductCard
          viewMode={viewMode}
          imageSrc="src/assets/user.jpg"
          title="Product title goes here"
          url="https://yourproducturlgoeshere1122.com"
          status="Removed"
          viewDetailsLink="#"
        />
        <ProductCard
          viewMode={viewMode}
          imageSrc="src/assets/user.jpg"
          title="Product title goes here"
          url="https://yourproducturlgoeshere1122.com"
          status="Removed"
          viewDetailsLink="#"
          sourceLink="#"
        />
        <ProductCard
          viewMode={viewMode}
          imageSrc="src/assets/user.jpg"
          title="Product title goes here"
          url="https://yourproducturlgoeshere1122.com"
          status="Reminder Sent"
          viewDetailsLink="#"
          sourceLink="#"
        />
        <ProductCard
          viewMode={viewMode}
          imageSrc="src/assets/user.jpg"
          title="Product title goes here"
          url="https://yourproducturlgoeshere1122.com"
          status="Removed"
          viewDetailsLink="#"
        />
        <ProductCard
          viewMode={viewMode}
          imageSrc="src/assets/user.jpg"
          title="Product title goes here"
          url="https://yourproducturlgoeshere1122.com"
          status="Removed"
          viewDetailsLink="#"
        />
      </Box>
    </>
  );
}
