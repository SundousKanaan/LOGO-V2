import { Flex } from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";
import TodoColumn from "./TodoColumn";

function TodoList({ listData, isEditable, ...props }) {
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
          <TodoColumn
            key={index}
            title={colTitle}
            data={listData}
            assignedList={{ title: listData.title, uid: listData.id }}
            isEditable={isEditable}
          />
        ))}
      </Flex>
    </>
  );
}

export default TodoList;
