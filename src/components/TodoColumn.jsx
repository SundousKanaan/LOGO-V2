import { useEffect, useState } from "react";
import TodoItem from "./mini-components/todoItem";
import {
  VStack,
  Icon,
  Center,
  HStack,
  Flex,
  Field,
  Fieldset,
  Avatar,
  Text,
  Textarea,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { useQueryClient } from "react-query";
import { FaPlus } from "react-icons/fa";
import { convertPx } from "../hooks/useConvertPx";
import { useAuth } from "../contexts/AuthContext";
import { postTodoItem } from "../services/postTodoItem";
import HeadingItem from "./mini-components/HeadingItem";
import ButtonItem from "./mini-components/ButtonItem";
import InputField from "./mini-components/Inputfield";
import Dropdown from "./mini-components/Dropdown";

import Popup from "./Popup";

function TodoColumn({ title, data, assignedList }) {
  const [colTitle, setColTitle] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { currentUser } = useAuth();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const queryClient = useQueryClient();
  const [isFormValid, setIsFormValid] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState(title);

  const taskStatus = createListCollection({
    items: [
      { label: "Todo", value: "pending" },
      { label: "Doing", value: "in_progress" },
      { label: "Done", value: "done" },
    ],
  });

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

  function handleOpenPopup() {
    setNewTaskTitle("");
    setNewTaskDescription("");
    setIsPopupOpen(!isPopupOpen);
  }

  function handleInputChange(e) {
    const value = e.target.value;
    console.log(e.target.name);

    if (e.target.name === "taskTitle") {
      setNewTaskTitle(value);
    } else if (e.target.name === "taskDescription") {
      setNewTaskDescription(value);
    }
  }

  useEffect(() => {
    setIsFormValid(
      newTaskTitle.trim() !== "" && newTaskDescription.trim() !== ""
    );
  }, [newTaskTitle, newTaskDescription]);

  async function saveTask() {
    if (isFormValid) {
      await postTodoItem({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
        status: newTaskStatus,
        assignee: currentUser.uid,
        todo_list: data[0].todo_list,
      });
      queryClient.invalidateQueries("dbTodolists");
      handleOpenPopup();
      setNewTaskTitle("");
      setNewTaskDescription("");
    }
  }

  return (
    <>
      <Popup
        isOpen={isPopupOpen}
        onClose={handleOpenPopup}
        selectedCol={title}
        colTitle={colTitle}
        onSave={saveTask}
        disableSaveButton={!isFormValid}
      >
        <Fieldset.Root>
          <Fieldset.Content>
            <HStack gap={convertPx(20)}>
              <Text w={convertPx(150)}>Status</Text>
              <Dropdown
                collection={taskStatus}
                defaultValue={title}
                handleChange={(value) => {
                  setNewTaskStatus(value.items[0].value);
                }}
                fontWeight={"bold"}
                buttonProps={{
                  bg:
                    title === "pending"
                      ? "lightThemeColor"
                      : title === "in_progress"
                      ? "statusOrangeLight"
                      : "statusGreenLight",
                  color:
                    title === "pending"
                      ? "themeColor"
                      : title === "in_progress"
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
            <HStack gap={convertPx(20)}>
              <Text w={convertPx(150)}>Assigned to</Text>
              <HStack>
                <Avatar.Root size="xs">
                  <Avatar.Fallback />
                  <Avatar.Image
                    src={currentUser.photo}
                    alt={`${currentUser.displayName} profile photo`}
                  />
                </Avatar.Root>
                <Text>{currentUser.displayName}</Text>
              </HStack>
            </HStack>
            <HStack gap={convertPx(20)}>
              <Text w={convertPx(150)}>Assigned list</Text>

              <Text>{assignedList}</Text>
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
                  onChange={handleInputChange}
                />
              </Flex>
            </Field.Root>
          </Fieldset.Content>
        </Fieldset.Root>
      </Popup>

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
          <HeadingItem
            fontSize={convertPx(16)}
            alignText="left"
            w="fit-content"
          >
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
          onClick={handleOpenPopup}
        >
          <Icon as={FaPlus} color="secondaryColor" h={convertPx(16)} />
          <HeadingItem fontSize={convertPx(13)} color="secondaryColor">
            Add new
          </HeadingItem>
        </ButtonItem>
      </VStack>
    </>
  );
}

export default TodoColumn;
