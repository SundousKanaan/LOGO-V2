import { useState, useEffect, useRef } from "react";
import {
  HStack,
  VStack,
  Text,
  Fieldset,
  Field,
  Textarea,
  Select,
  createListCollection,
  Grid,
  Skeleton,
} from "@chakra-ui/react";
import { convertPx } from "../../hooks/useConvertPx";
import Dropdown from "../mini-components/Dropdown";
import InputField from "../mini-components/InputField";
import Checkboxes from "../mini-components/checkboxes";
import { useAllUsers } from "../../hooks/useUserHooks";

function AddNewTodoItem({ defaultStatus, assignedList, onFormChange }) {
  const prevFormDataRef = useRef({});
  const [taskStatus, setTaskStatus] = useState(defaultStatus);
  const { data: dbUsers, isLoading } = useAllUsers();
  const [usersData, setUsersData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const statusCollection = createListCollection({
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
  }, [isLoading]);

  function changeStatus(newValue) {
    setTaskStatus(newValue.items[0].value);
  }

  function handleSelectedUsers(event) {
    const userId = event.target.value;
    const userData = dbUsers.find((user) => user.id === userId);

    const isChecked = event.target.checked;

    setSelectedUsers((prevSelected) => {
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
      setTaskTitle(value);
    } else if (name === "taskDescription") {
      setTaskDescription(value);
    }
  }

  useEffect(() => {
    if (!assignedList) return;

    const currentFormData = {
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      status: taskStatus,
      assignee: selectedUsers,
      todo_list: assignedList.id,
    };

    const prevFormData = prevFormDataRef.current;

    const hasChanged =
      JSON.stringify(prevFormData) !== JSON.stringify(currentFormData);

    if (hasChanged) {
      prevFormDataRef.current = currentFormData; // Update the ref with the current form data
      if (onFormChange) onFormChange(currentFormData);
    }
  }, [
    assignedList,
    taskTitle,
    taskDescription,
    taskStatus,
    selectedUsers,
    onFormChange,
  ]);

  return (
    <Fieldset.Root>
      <Fieldset.Content>
        <HStack gap={convertPx(20)}>
          <Text w={convertPx(150)}>Status</Text>
          <Dropdown
            collection={statusCollection}
            defaultValue={defaultStatus}
            withIndicator
            handleChange={changeStatus}
            fontWeight={"bold"}
            buttonProps={{
              bg:
                taskStatus === "pending"
                  ? "lightThemeColor"
                  : taskStatus === "in_progress"
                  ? "statusOrangeLight"
                  : "statusGreenLight",
              color:
                taskStatus === "pending"
                  ? "themeColor"
                  : taskStatus === "in_progress"
                  ? "statusOrange"
                  : "statusGreen",
              border: "none",
            }}
          >
            {statusCollection.items.map((taskState) => (
              <Select.Item item={taskState} key={taskState.value}>
                <Select.ItemText>{taskState.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Dropdown>
        </HStack>
        <Grid
          gap={convertPx(20)}
          templateColumns={{
            base: `1fr`,
            sm: `${convertPx(150)} 1fr`,
          }}
        >
          <Text>Assigned to</Text>

          <HStack
            overflow={"auto"}
            w={"100%"}
            border={"solid 1px var(--chakra-colors-gray-300)"}
            borderRadius={convertPx(4)}
          >
            <Checkboxes
              options={usersData}
              variant={"subtle"}
              h={"fit-content"}
              maxH={convertPx(100)}
              p={`${convertPx(8)} ${convertPx(8)}`}
              overflow="auto"
              withIcon
              onChange={handleSelectedUsers}
              isLoading={isLoading}
            />
          </HStack>
        </Grid>
        <Grid gap={convertPx(20)} templateColumns={`${convertPx(150)} 1fr`}>
          <Text>Assigned list</Text>

          <Text>{assignedList.title}</Text>
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

export default AddNewTodoItem;
