import { useState } from "react";
import {
  Flex,
  HStack,
  Spacer,
  Text,
  Icon,
  Avatar,
  Portal,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { useQueryClient } from "react-query";
import { convertPx } from "../../hooks/useConvertPx";
import { FaRegClock } from "react-icons/fa6";
import { MdUpdate } from "react-icons/md";
import { useAuth } from "../../contexts/AuthContext";
import HeadingItem from "./HeadingItem";
import { putTodoItem } from "../../services/putTodoItem";

function TodoItem({ data }) {
  const status = createListCollection({
    items: [
      { label: "Todo", value: "pending" },
      { label: "Doing", value: "in_progress" },
      { label: "Done", value: "done" },
    ],
  });
  const { currentUser } = useAuth();
  const [currentStatus, setCurrentStatus] = useState(
    status.items.find((item) => item.value === data.status) || status.items[0]
  );
  const queryClient = useQueryClient();

  const handleChange = async (newValue) => {
    setCurrentStatus(newValue.items[0]);
    const req = {
      method: "PUT",
      data: {
        ...data,
        status: newValue.items[0].value,
      },
    };
    await putTodoItem(req);
    queryClient.invalidateQueries("dbTodolists");
  };

  return (
    <Flex layerStyle="TodoItemLayout">
      <HStack>
        <HeadingItem fontSize={convertPx(16)} lineClamp={1}>
          {data.title}
        </HeadingItem>
        <Spacer />
        <Select.Root
          collection={status}
          width={convertPx(100)}
          defaultValue={[currentStatus.value]}
          onValueChange={handleChange}
        >
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Select status" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {status.items.map((state) => (
                  <Select.Item item={state} key={state.value}>
                    <Select.ItemText>{state.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </HStack>
      <Text color="gray.500" fontSize={convertPx(14)}>
        {data.description}
      </Text>

      <HStack
        borderTop={`${convertPx(1)} solid var(--chakra-colors-gray-200)`}
        pt={convertPx(8)}
        pb={convertPx(8)}
        mt={convertPx(8)}
      >
        <Avatar.Root size={"2xs"}>
          <Avatar.Fallback name={currentUser?.displayName} />
          <Avatar.Image
            src={currentUser?.photo}
            alt={`${currentUser?.displayName} profile photo`}
          />
        </Avatar.Root>

        <Spacer />
        <HStack gap={convertPx(5)} p={`${convertPx(2)} ${convertPx(8)}`}>
          <Icon as={FaRegClock} size={convertPx(14)} color={"gray.500"} />

          <Text fontSize={convertPx(14)} color={"gray.500"}>
            1 apr
          </Text>
        </HStack>

        <HStack
          gap={convertPx(5)}
          bg={"statusGreenLight"}
          p={`${convertPx(2)} ${convertPx(8)}`}
          borderRadius={convertPx(4)}
        >
          <Icon as={MdUpdate} size={convertPx(14)} color={"gray.500"} />

          <Text fontSize={convertPx(14)} color={"gray.500"}>
            2 apr
          </Text>
        </HStack>
      </HStack>
    </Flex>
  );
}

export default TodoItem;
