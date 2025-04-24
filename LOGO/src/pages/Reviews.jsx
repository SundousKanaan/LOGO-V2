import { useState } from "react";
import { Flex, Spacer, HStack, ButtonGroup, Text, Box } from "@chakra-ui/react";
import ProductCard from "../components/ProductCard";
import ButtonItem from "../mini-components/ButtonItem";

export default function Reviews() {
  const [viewMode, setViewMode] = useState("grid");

  const handleViewModeChange = (mode) => {
    console.log("View mode changed to:", mode);

    setViewMode(mode);
  };

  return (
    <>
      <Flex
        height={{ base: "fit-content", lg: "45px" }}
        alignItems={{ base: "start", lg: "center" }}
        marginBottom="24px"
        flexDirection={{ base: "column", md: "row" }}
      >
        <Text
          fontSize="18px"
          fontWeight="500"
          color="secondaryColor"
          mb={{ base: "8px", md: "0" }}
        >
          Product List
        </Text>

        <Spacer />

        <HStack
          spacing="8px"
          width={{ base: "fit-content", sm: "100%", md: "fit-content" }}
          justifyContent="space-between"
        >
          <ButtonGroup variant="solid" spacing="12px">
            <ButtonItem
              bg={viewMode === "grid" ? "secondaryColor" : "white"}
              color={viewMode === "grid" ? "white" : "secondaryColor"}
              padding="9px 21px"
              borderRadius="10px"
              onClick={() => handleViewModeChange("grid")}
            >
              Grid View
            </ButtonItem>

            <ButtonItem
              bg={viewMode === "list" ? "secondaryColor" : "white"}
              color={viewMode === "list" ? "white" : "secondaryColor"}
              padding="9px 21px"
              borderRadius="10px"
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
            ? "ProductCardsListGridLayaout"
            : "ProductCardsListLayaout"
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
