import React from "react";
import { Image, Text, Grid, GridItem } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import HeadingItem from "../components/mini-components/HeadingItem";
import ChartLine from "../components/mini-components/ChartLine";
import { ArrowTopIcon } from "../global/icons";

export default function CountingCard({
  title,
  counting,
  changeRatio,
  icon,
  date,
  chart,
  ...props
}) {
  return (
    <Grid
      layerStyle="dashboardCardsLayout"
      templateColumns="155px 1fr"
      templateRows="42px 20px  48px 30px auto"
      {...props}
    >
      <GridItem
        gridColumn="1 / 3"
        gridRow="1 / 3"
        display="flex"
        opacity="60%"
        width="100%"
        height="42px"
        alignItems="center"
        gap="8px"
      >
        {React.createElement(icon, { size: "lg", color: "secondaryColor" })}

        <HeadingItem
          fontWeight="400"
          fontSize="16px"
          color="secondaryColor"
          width="fit-content"
        >
          {title}
        </HeadingItem>
      </GridItem>
      <GridItem
        width="100%"
        height="48px"
        flexDir="row"
        gap="12px"
        display="flex"
        alignContent="center"
        alignItems="center"
      >
        <Text
          fontSize="40px"
          fontWeight="600"
          color="secondaryColor"
          lineHeight="120%"
        >
          {counting}
        </Text>
      </GridItem>

      {/* TODO: make the bg & color to dynamic */}
      {changeRatio && (
        <GridItem
          gridColumn="2 / 3"
          gridRow="3 / 4"
          alignSelf="center"
          display="flex"
          alignItems="center"
          gap="4.5px"
          width="60px"
          height="28px"
          bg="statusGreenLight"
          padding="9px 8px"
          borderRadius="full"
        >
          {/* TODO: make the icon dynamic rising or falling */}
          <Icon
            as={ArrowTopIcon}
            color="statusGreen"
            height="8px"
            width="8px"
          />
          <Text
            color="statusGreen"
            fontFamily="body"
            fontSize="10px"
            fontWeight="600"
          >
            {changeRatio}
          </Text>
        </GridItem>
      )}
      <GridItem gridColumn="1 / 3" gridRow="4 / 5" alignSelf="end">
        <Text
          fontWeight="400"
          fontSize="14px"
          color="secondaryColor"
          width="fit-content"
          opacity="0.5"
        >
          {date}
        </Text>
      </GridItem>

      {chart && (
        <GridItem
          gridColumn="2 / 3"
          gridRow="2 / 4"
          alignSelf="end"
          width="100%"
          height="88px"
        >
          <ChartLine />
        </GridItem>
      )}
    </Grid>
  );
}
