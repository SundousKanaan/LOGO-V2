import { useState, useEffect } from "react";
import {
  HStack,
  VStack,
  Box,
  Text,
  Avatar,
  Fieldset,
  Field,
  Flex,
  Textarea,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { convertPx } from "../../hooks/useConvertPx";
import Dropdown from "../mini-components/Dropdown";
import InputField from "../mini-components/InputField";
import Checkboxes from "../mini-components/checkboxes";
import { useUsers } from "../../services/users/getUsers";

function AddNewTodoItem({
  title,
  assignedList,
  handleStatusChange,
  handleInputChange,
  onChange,
}) {
  const [newStatus, setTaskStatus] = useState(title);
  const { data: dbUsers, isLoading } = useUsers();
  const [usersData, setUsersData] = useState([]);

  const taskStatus = createListCollection({
    items: [
      { label: "Todo", value: "pending" },
      { label: "Doing", value: "in_progress" },
      { label: "Done", value: "done" },
    ],
  });

  useEffect(() => {
    if (!isLoading) {
      const data = dbUsers.map((user) => ({
        id: user.firebase_uid,
        displayName: `${user.first_name} ${user.last_name}`,
        photo: user.photo,
      }));

      setUsersData(data);
    }
  }, [isLoading, dbUsers]);

  function changeStatus(newValue) {
    setTaskStatus(newValue.items[0].value);
    handleStatusChange(newValue.items[0].value);
  }

  if (isLoading) {
    return (
      <Box p={convertPx(20)} textAlign="center">
        <Text>Loading...</Text>
      </Box>
    );
  }
  return (
    <Fieldset.Root>
      <Fieldset.Content>
        <HStack gap={convertPx(20)}>
          <Text w={convertPx(150)}>Status</Text>
          <Dropdown
            collection={taskStatus}
            defaultValue={title}
            withIndicator
            handleChange={changeStatus}
            fontWeight={"bold"}
            buttonProps={{
              bg:
                newStatus === "pending"
                  ? "lightThemeColor"
                  : newStatus === "in_progress"
                  ? "statusOrangeLight"
                  : "statusGreenLight",
              color:
                newStatus === "pending"
                  ? "themeColor"
                  : newStatus === "in_progress"
                  ? "statusOrange"
                  : "statusGreen",
              border: "none",
            }}
          >
            {taskStatus.items.map((taskState) => (
              <Select.Item item={taskState} key={taskState.value}>
                <Select.ItemText>{taskState.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Dropdown>
        </HStack>
        <VStack gap={convertPx(20)} align={"start"}>
          <Text w={convertPx(150)}>Assigned to</Text>
          <HStack
            overflow={"auto"}
            w={"100%"}
            border={"solid 1px var(--chakra-colors-gray-300)"}
            borderRadius={convertPx(4)}
          >
            {usersData && (
              <Checkboxes
                options={usersData}
                variant={"subtle"}
                minH={"fit-content"}
                maxH={convertPx(100)}
                p={`${convertPx(8)} ${convertPx(8)}`}
                overflow="auto"
                withIcon
                onChange={onChange}
              />
            )}
          </HStack>
        </VStack>
        <HStack gap={convertPx(20)}>
          <Text w={convertPx(150)}>Assigned list</Text>

          <Text>{assignedList.title}</Text>
        </HStack>
        <Field.Root>
          <HStack gap={convertPx(20)} align={"start"}>
            <Field.Label w={convertPx(230)}>Task name</Field.Label>
            <InputField
              w={"100%"}
              name="taskTitle"
              placeholder="Enter task name"
              borderColor="gray.300"
              h={"fit-content"}
              pt={convertPx(8)}
              pb={convertPx(8)}
              color="secondaryColor"
              onChange={handleInputChange}
            />
          </HStack>
        </Field.Root>
        <Field.Root>
          <Flex
            w={"100%"}
            gap={{ base: convertPx(10), lg: convertPx(22) }}
            align={"start"}
            flexDirection={{ base: "column", lg: "row" }}
          >
            <Field.Label w={convertPx(242)}>Task description</Field.Label>
            <Textarea
              w={"100%"}
              name="taskDescription"
              placeholder="Enter task description"
              borderColor="gray.300"
              h={"fit-content"}
              pt={convertPx(8)}
              pb={convertPx(8)}
              bg="white"
              color="secondaryColor"
              onChange={handleInputChange}
            />
          </Flex>
        </Field.Root>
      </Fieldset.Content>
    </Fieldset.Root>
  );
}

export default AddNewTodoItem;
