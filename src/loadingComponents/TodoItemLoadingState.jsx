import {
  Box,
  HStack,
  VStack,
  Spacer,
  Avatar,
  AvatarGroup,
} from "@chakra-ui/react";
import GradientLoadingBar from "./gradientLoadingBar";
import { convertPx } from "../hooks/useConvertPx";

function TodoItemLoadingState() {
  return (
    <Box layerStyle="TodoItemLayout">
      <VStack
        alignItems={"start"}
        borderBottom={`${convertPx(1)} solid var(--chakra-colors-gray-200)`}
        pb={convertPx(8)}
      >
        <GradientLoadingBar h={convertPx(24)} w={"60%"} />
        <GradientLoadingBar h={convertPx(24)} w={convertPx(100)} />
      </VStack>
      <Box pt={convertPx(8)}>
        <GradientLoadingBar h={convertPx(24)} />
      </Box>

      <HStack
        borderTop={`${convertPx(1)} solid var(--chakra-colors-gray-200)`}
        pt={convertPx(8)}
        pb={convertPx(8)}
        mt={convertPx(8)}
      >
        <AvatarGroup>
          {[...Array(3)].map((_, idx) => (
            <Avatar.Root
              key={idx}
              size={"2xs"}
              borderWidth={convertPx(2)}
              borderColor={"white"}
            >
              <Avatar.Fallback>
                <Box />
              </Avatar.Fallback>
            </Avatar.Root>
          ))}
        </AvatarGroup>
        <Spacer />
        <GradientLoadingBar h={convertPx(16)} w={convertPx(75)} />
        <GradientLoadingBar h={convertPx(16)} w={convertPx(75)} />
      </HStack>
    </Box>
  );
}

export default TodoItemLoadingState;
