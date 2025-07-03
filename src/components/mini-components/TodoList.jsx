import { Flex } from "@chakra-ui/react";
import { convertPx } from "../../hooks/useConvertPx";

function TodoList({ children, ...props }) {
  return (
    <>
      <Flex
        gap={convertPx(20)}
        overflowX={"auto"}
        overscrollBehaviorX={"contain"}
        scrollSnapType={"x mandatory"}
        paddingBottom={convertPx(32)}
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "transparent",
          },
        }}
        {...props}
      >
        {children}
      </Flex>
    </>
  );
}

export default TodoList;
