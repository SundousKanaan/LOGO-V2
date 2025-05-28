import { useState } from "react";
import {
  Flex,
  HStack,
  Spacer,
  Text,
  Icon,
  Avatar,
  AvatarGroup,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { UsePickRandomColor } from "../../hooks/usePickRandomColor";
import { convertPx } from "../../hooks/useConvertPx";
import { FaRegClock } from "react-icons/fa6";
import { MdUpdate } from "react-icons/md";
import { useQueryClient } from "react-query";
import { putTodoItem } from "../../services/putTodoItem";
import HeadingItem from "./HeadingItem";
import Dropdown from "./Dropdown";

function TodoItem({ data }) {
  const status = createListCollection({
    items: [
      { label: "Todo", value: "pending" },
      { label: "Doing", value: "in_progress" },
      { label: "Done", value: "done" },
    ],
  });
  const queryClient = useQueryClient();
  const [currentStatus, setCurrentStatus] = useState(
    status.items.find((item) => item.value === data.status) || status.items[0]
  );

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
        <Dropdown
          collection={status}
          defaultValue={currentStatus.value}
          handleChange={handleChange}
          withIndicator
        >
          {status.items.map((state) => (
            <Select.Item item={state} key={state.value}>
              <Select.ItemText>{state.label}</Select.ItemText>
            </Select.Item>
          ))}
        </Dropdown>
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
        <AvatarGroup>
          {data.assignee.map((assigneeItem) => (
            <Avatar.Root
              size={"2xs"}
              borderWidth={convertPx(2)}
              borderColor={"white"}
              colorPalette={UsePickRandomColor(`${assigneeItem?.first_name}`)}
            >
              <Avatar.Fallback
                name={`${assigneeItem?.first_name} ${assigneeItem?.last_name}`}
              />
              <Avatar.Image
                src={assigneeItem?.photo}
                alt={`${assigneeItem?.first_name} ${assigneeItem?.last_name} profile photo`}
              />
            </Avatar.Root>
          ))}
        </AvatarGroup>

        <Spacer />
        <HStack gap={convertPx(5)} p={`${convertPx(2)} ${convertPx(8)}`}>
          <Icon as={FaRegClock} size={convertPx(14)} color={"gray.500"} />

          <Text fontSize={convertPx(14)} color={"gray.500"}>
            {new Date(data.created_at).toLocaleDateString("nl-NL", {
              day: "2-digit",
              month: "short",
            })}
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
            {new Date(data.last_modified).toLocaleDateString("nl-NL", {
              day: "2-digit",
              month: "short",
            })}
          </Text>
        </HStack>
      </HStack>
    </Flex>
  );
}

export default TodoItem;
