import { Grid, Icon, HStack, Text } from "@chakra-ui/react";
import HeadingItem from "../mini-components/HeadingItem";
import LinkItem from "../mini-components/LinkItem";

export default function Profile() {
  return (
    <Grid w="100%" h="100%" placeContent="center" justify-items="stretch">
      <HeadingItem textAlign="center">Welcome back John!</HeadingItem>
      <Text textAlign="center">Have you a great day!</Text>

      <LinkItem
        path="/login"
        variant="button"
        mt="20px"
        bg="themeColor"
        color="white"
        fontWeight="600"
        display="grid"
        placeContent="center"
      >
        <HStack>
          <Icon color="white" boxSize="20px" mr="10px">
            <img src="src/assets/icons/logout-active.svg" alt="logout icon" />
          </Icon>
          Log out
        </HStack>
      </LinkItem>
    </Grid>
  );
}
