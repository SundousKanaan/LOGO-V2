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
import { MdOutlineDeleteForever } from "react-icons/md";
import { UsePickRandomColor } from "../../hooks/usePickRandomColor";
import { convertPx } from "../../hooks/useConvertPx";
import { FaRegClock } from "react-icons/fa6";
import { MdUpdate } from "react-icons/md";
import { useQueryClient } from "react-query";
import { putTodoItem } from "../../services/updateTodoItem";
import { deleteTodoItem } from "../../services/deleteTodoItem";
import HeadingItem from "./HeadingItem";
import Dropdown from "./Dropdown";
import ButtonItem from "./ButtonItem";
import Popup from "./Popup";

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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [poupTitle, setPopupTitle] = useState("");

  const handleChange = async (newValue) => {
    setCurrentStatus(newValue.items[0]);
    const req = {
      method: "PUT",
      data: {
        ...data,
        //the assignee is an array of objects,
        //we need to map it to an array of firebase_uids only
        // this is because the backend expects an array of firebase_uids
        assignee: data.assignee.map((assignee) => assignee.firebase_uid),
        status: newValue.items[0].value,
      },
    };

    await putTodoItem(req);
    queryClient.invalidateQueries("dbTodolists");
  };

  function confirmDelete(name) {
    setIsPopupOpen(true);
    setPopupTitle(name);
  }

  async function handleTaskDelete(id) {
    // Logic to delete the task
    await deleteTodoItem({ id });
    queryClient.invalidateQueries("dbTodolists");
    setIsPopupOpen(false);
  }

  return (
    <>
      <Flex layerStyle="TodoItemLayout">
        <HStack
          borderBottom={`${convertPx(1)} solid var(--chakra-colors-gray-200)`}
          pb={convertPx(8)}
        >
          <HeadingItem fontSize={convertPx(16)} lineHeight={1.5}>
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
          <ButtonItem
            variant="ghost"
            size="md"
            h={convertPx(30)}
            pl={convertPx(8)}
            pr={convertPx(8)}
            onClick={() => confirmDelete(data.title)}
          >
            <Icon as={MdOutlineDeleteForever} color="secondaryColor" />
          </ButtonItem>
        </HStack>
        <Text
          pt={convertPx(8)}
          pb={convertPx(8)}
          color="gray.500"
          fontSize={convertPx(14)}
        >
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
                key={assigneeItem.first_name}
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
      <Popup
        isOpen={isPopupOpen}
        title={`Delete ${poupTitle}`}
        ActionButtonText="Delete task"
        onClose={() => setIsPopupOpen(false)}
        onSave={() => {
          handleTaskDelete(data.id);
        }}
      >
        <Text>Are you sure you want to delete this task?</Text>
      </Popup>
    </>
  );
}

export default TodoItem;
