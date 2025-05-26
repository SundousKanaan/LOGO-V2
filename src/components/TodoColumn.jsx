import { useEffect, useState } from "react";
import TodoItem from "./mini-components/todoItem";
import { VStack, Icon } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { convertPx } from "../hooks/useConvertPx";
import HeadingItem from "./mini-components/HeadingItem";
import ButtonItem from "./mini-components/ButtonItem";

function TodoColumn({ title, data }) {
  const [colTitle, setColTitle] = useState();

  useEffect(() => {
    if (!title) return;

    if (title === "pending") {
      setColTitle("Todo");
    } else if (title === "in_progress") {
      setColTitle("Doing");
    } else if (title === "done") {
      setColTitle("Done");
    }
  }, [title]);

  return (
    <VStack
      w="19em"
      h="fit-content"
      borderRadius={convertPx(4)}
      border={`dashed ${convertPx(2)} var(--chakra-colors-gray-400)`}
      padding={convertPx(8)}
      flexShrink={0}
      scrollSnapAlign={"center"}
    >
      <HeadingItem fontSize={convertPx(16)}>{colTitle}</HeadingItem>

      {data.map((item, index) =>
        item.status === title ? <TodoItem key={index} data={item} /> : null
      )}

      <ButtonItem w="100%" bg="gray.200">
        <Icon as={FaPlus} color="gray.500" />
      </ButtonItem>
    </VStack>
  );
}

export default TodoColumn;
