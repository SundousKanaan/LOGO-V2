import React from "react";
import { Text, Grid, GridItem } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";

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
      templateColumns={`${convertPx(155)} 1fr`}
      templateRows={`${convertPx(42)} ${convertPx(20)} ${convertPx(
        48
      )} ${convertPx(30)} auto`}
      {...props}
    >
      <GridItem
        gridColumn="1 / 3"
        gridRow="1 / 3"
        display="flex"
        opacity="60%"
        width="100%"
        height={convertPx(42)}
        alignItems="center"
        gap={convertPx(8)}
      >
        {React.createElement(icon, { size: "lg", color: "secondaryColor" })}

        <HeadingItem
          fontWeight="400"
          fontSize={convertPx(16)}
          color="secondaryColor"
          width="fit-content"
        >
          {title}
        </HeadingItem>
      </GridItem>
      <GridItem
        width="100%"
        height={convertPx(48)}
        flexDir="row"
        gap={convertPx(12)}
        display="flex"
        alignContent="center"
        alignItems="center"
      >
        <Text
          fontSize={convertPx(40)}
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
          gap={convertPx(4.5)}
          width={convertPx(60)}
          height={convertPx(28)}
          bg="statusGreenLight"
          padding={`${convertPx(9)} ${convertPx(8)}`}
          borderRadius="full"
        >
          {/* TODO: make the icon dynamic rising or falling */}
          <Icon
            as={ArrowTopIcon}
            color="statusGreen"
            height={convertPx(8)}
            width={convertPx(8)}
          />
          <Text
            color="statusGreen"
            fontFamily="body"
            fontSize={convertPx(10)}
            fontWeight="600"
          >
            {changeRatio}
          </Text>
        </GridItem>
      )}
      <GridItem gridColumn="1 / 3" gridRow="4 / 5" alignSelf="end">
        <Text
          fontWeight="400"
          fontSize={convertPx(14)}
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
