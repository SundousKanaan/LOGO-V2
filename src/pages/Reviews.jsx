import { useRef, useCallback, useState, useMemo } from "react";

import {
  Flex,
  Spacer,
  HStack,
  ButtonGroup,
  Text,
  Box,
  Skeleton,
} from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";
import { useProducts } from "../services/productsServices";

import ProductCard from "../components/ProductCard";
import ButtonItem from "../components/mini-components/ButtonItem";

export default function Reviews() {
  const [viewMode, setViewMode] = useState("grid");
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useProducts();
  const observer = useRef();
  const lastProductElementRef = useCallback(
    (node) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage]
  );

  const products = useMemo(() => {
    return (
      data?.pages.reduce((acc, page) => {
        return [...acc, ...page];
      }, []) || []
    );
  }, [data]);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <>
      <Flex
        height={{ base: "fit-content", lg: convertPx(45) }}
        alignItems={{ base: "start", lg: "center" }}
        marginBottom={convertPx(24)}
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
          width="fit-content"
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
        {products && isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <Skeleton
                key={index}
                loading={isLoading}
                borderRadius={convertPx(24)}
              >
                <ProductCard viewMode={viewMode} />
              </Skeleton>
            ))
          : products.map((product, index) => {
              const isLastProduct = products.length === index + 1;
              return (
                <ProductCard
                  ref={isLastProduct ? lastProductElementRef : null}
                  data={product}
                  key={index}
                  viewMode={viewMode}
                />
              );
            })}
      </Box>
    </>
  );
}
