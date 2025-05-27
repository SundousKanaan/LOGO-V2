import { useEffect, useState } from "react";
import TodoItem from "./mini-components/todoItem";
import { VStack, Icon, Center, HStack } from "@chakra-ui/react";
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
      w={convertPx(300)}
      h="fit-content"
      borderRadius={convertPx(4)}
      padding={convertPx(8)}
      flexShrink={0}
      flexGrow={{ base: 0, md: 1 }}
      scrollSnapAlign={"center"}
    >
      <HStack w={"100%"} justifyContent={"start"}>
        <HeadingItem fontSize={convertPx(16)} alignText="left" w="fit-content">
          {colTitle}
        </HeadingItem>
        {data.filter((item) => item.status === title).length !== 0 && (
          <Center
            ml={convertPx(8)}
            bg={"themeColor"}
            borderRadius={"full"}
            h={convertPx(24)}
            w={convertPx(24)}
            fontSize={convertPx(14)}
            color="white"
          >
            {data.filter((item) => item.status === title).length}
          </Center>
        )}
      </HStack>

      {data.map((item, index) =>
        item.status === title ? <TodoItem key={index} data={item} /> : null
      )}

      <ButtonItem
        w="100%"
        bg="gray.200"
        border={`dashed ${convertPx(2)} var(--chakra-colors-gray-400)`}
        _hover={{
          borderColor: "themeColor",
          boxShadow: "none",
        }}
      >
        <Icon as={FaPlus} color="secondaryColor" h={convertPx(16)} />
        <HeadingItem fontSize={convertPx(13)} color="secondaryColor">
          Add new
        </HeadingItem>
      </ButtonItem>
    </VStack>
  );
}

export default TodoColumn;
