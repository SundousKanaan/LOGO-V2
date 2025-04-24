import { Box, Stack, Image, Text, HStack } from "@chakra-ui/react";
import HeadingItem from "../mini-components/HeadingItem";
import ChartLine from "../mini-components/ChartLine";

export default function CountingBox({
  title,
  counting,
  changeRatio,
  icon,
  date,
  chart,
  ...props
}) {
  // TODO:  add the chart line
  return (
    <Box layerStyle="dashboardCardsLayaout" {...props} position="relative">
      <Stack
        opacity="60%"
        width="100%"
        height="42px"
        flexDirection="row"
        alignItems="center"
        gap="8px"
        marginBottom="20px"
      >
        <Image
          src={`/src/assets/icons/${icon}.svg`}
          alt={`${icon} icon`}
          boxSize="24px"
          objectFit="cover"
        />
        <HeadingItem
          fontWeight="400"
          fontSize="16px"
          color="secondaryColor"
          width="fit-content"
        >
          {title}
        </HeadingItem>
      </Stack>
      <Stack
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

        {/* TODO: make the bg & color to dynamic */}
        {changeRatio && (
          <HStack
            spacing="4.5px"
            height="28px"
            bg="lightrRisingColor"
            padding="9px 8px"
            borderRadius="full"
          >
            {/* TODO: make the icon dynamic rising or falling */}
            <Image
              src="/src/assets/icons/rising-arrow.svg"
              alt="Placeholder Image"
            />
            <Text
              color="risingColor"
              fontFamily="body"
              fontSize="10px"
              fontWeight="600"
            >
              {changeRatio}
            </Text>
          </HStack>
        )}
      </Stack>
      <Text
        fontWeight="400"
        fontSize="14px"
        color="secondaryColor"
        width="fit-content"
        opacity="0.5"
        marginTop="8px"
      >
        {date}
      </Text>

      {chart && (
        <Box
          width="155px"
          height="88px"
          position="absolute"
          top="47px"
          right="24px"
        >
          <ChartLine />
        </Box>
      )}
    </Box>
  );
}
