import { Flex } from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";
import TodoColumn from "./TodoColumn";

function TodoList({ data, ...props }) {
  const colTitels = ["pending", "in_progress", "done"];

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
        {colTitels.map((colTitle, index) => (
          <TodoColumn key={index} title={colTitle} data={data.items} />
        ))}
      </Flex>
    </>
  );
}

export default TodoList;
