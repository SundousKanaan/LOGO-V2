import { useState, useEffect } from "react";
import {
  HStack,
  VStack,
  Box,
  Text,
  Grid,
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
import { useAllUsers } from "../../hooks/useUserHooks";

function EditeTodoItem({ data, onChange }) {
  const { data: dbUsers, isLoading } = useAllUsers();
  const [newStatus, setTaskStatus] = useState(data.status);
  const [usersData, setUsersData] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState(data.assignee);
  const [newDescription, setNewDescription] = useState(data.description);
  const [newTaskTitle, setNewTaskTitle] = useState(data.title);

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
        id: user.id,
        displayName: `${user.first_name} ${user.last_name}`,
        photo: user.photo,
      }));

      setUsersData(data);
    }
  }, [isLoading, dbUsers]);

  useEffect(() => {
    const newData = {
      ...data,
      title: newTaskTitle,
      description: newDescription,
      assignee: selectedAssignee,
      status: newStatus,
    };
    if (onChange) {
      onChange(newData);
    }
  }, [newTaskTitle, newDescription, selectedAssignee, newStatus]);

  function changeStatus(newValue) {
    setTaskStatus(newValue.items[0].value);
  }

  function handleCheckboxChange(event) {
    const userId = event.target.value;
    const userData = dbUsers.find((user) => user.id === userId);

    const isChecked = event.target.checked;

    setSelectedAssignee((prevSelected) => {
      if (isChecked) {
        return [
          ...prevSelected,
          {
            id: userId,
            first_name: userData.first_name,
            last_name: userData.last_name,
          },
        ];
      } else {
        return prevSelected.filter((user) => user.id !== userId);
      }
    });
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    if (name === "taskTitle") {
      setNewTaskTitle(value);
    } else if (name === "taskDescription") {
      setNewDescription(value);
    }
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
            defaultValue={data.status}
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
                selectedIds={data.assignee.map((assignee) => assignee.id)}
                onChange={handleCheckboxChange}
              />
            )}
          </HStack>
        </VStack>
        <Grid gap={convertPx(20)} templateColumns={`${convertPx(150)} 1fr`}>
          <Text>Assigned list</Text>
          <Text>{data.todo_list.title}</Text>
        </Grid>
        <Field.Root>
          <Grid
            w={"100%"}
            gap={convertPx(20)}
            templateColumns={`${convertPx(150)} 1fr`}
          >
            <Field.Label>Task name</Field.Label>
            <InputField
              w={"100%"}
              name="taskTitle"
              defaultValue={data.title}
              placeholder="Enter task name"
              borderColor="gray.300"
              h={"fit-content"}
              pt={convertPx(8)}
              pb={convertPx(8)}
              color="secondaryColor"
              onChange={handleInputChange}
            />
          </Grid>
        </Field.Root>
        <Field.Root>
          <Grid
            width={"100%"}
            gap={convertPx(20)}
            templateColumns={{ base: "1fr", sm: `${convertPx(150)} 1fr` }}
          >
            <Field.Label>Task description</Field.Label>
            <Textarea
              w={"100%"}
              name="taskDescription"
              defaultValue={data.description}
              placeholder="Enter task description"
              borderColor="gray.300"
              h={"fit-content"}
              pt={convertPx(8)}
              pb={convertPx(8)}
              bg="white"
              color="secondaryColor"
              onChange={handleInputChange}
              _required={false}
            />
          </Grid>
        </Field.Root>
      </Fieldset.Content>
    </Fieldset.Root>
  );
}

export default EditeTodoItem;
