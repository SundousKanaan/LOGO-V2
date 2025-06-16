import { useEffect, useState } from "react";
import TodoItem from "./mini-components/todoItem";
import { VStack, Icon, Center, HStack } from "@chakra-ui/react";
import { useQueryClient } from "react-query";
import { FaPlus } from "react-icons/fa";
import { convertPx } from "../hooks/useConvertPx";
import { postTodoItem } from "../services/todoItem/postTodoItem";

import HeadingItem from "./mini-components/HeadingItem";
import ButtonItem from "./mini-components/ButtonItem";
import AddNewTodoItem from "./forms-components/AddNewTodoItem";
import Popup from "./mini-components/Popup";

function TodoColumn({ title, data, assignedList, isEditable }) {
  const queryClient = useQueryClient();
  const [colTitle, setColTitle] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState(title);
  const [assigneeUsers, setAssigneeUsers] = useState([]);

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
    if (e.target.name === "taskTitle") {
      setNewTaskTitle(value);
    } else if (e.target.name === "taskDescription") {
      setNewTaskDescription(value);
    }
  }

  function handleCheckboxChange(e) {
    setAssigneeUsers((prev) => {
      if (prev.includes(e.target.value)) {
        return prev.filter((id) => id !== e.target.value);
      } else {
        return [...prev, e.target.value];
      }
    });
  }

  useEffect(() => {
    setIsFormValid(newTaskTitle.trim() !== "");
  }, [newTaskTitle, newTaskDescription]);

  async function saveTask(listUid) {
    if (isFormValid) {
      const req = {
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
        status: newTaskStatus,
        assignee: assigneeUsers, // assignee is an array of user IDs
        todo_list: listUid,
      };
      await postTodoItem(req);
      queryClient.invalidateQueries("dbTodolists");
      handleOpenPopup();
      setNewTaskTitle("");
      setNewTaskDescription("");
    }
  }

  return (
    <>
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
          {data.items.filter((item) => item.status === title).length !== 0 && (
            <Center
              ml={convertPx(8)}
              bg={"themeColor"}
              borderRadius={"full"}
              h={convertPx(24)}
              w={convertPx(24)}
              fontSize={convertPx(14)}
              color="white"
            >
              {data.items.filter((item) => item.status === title).length}
            </Center>
          )}
        </HStack>

        {data.items
          .filter((item) => item.status === title)
          .map((item, index) => (
            <TodoItem
              key={index}
              data={item}
              listMembers={data.members}
              isEditable={isEditable}
              assignedList={assignedList}
            />
          ))}

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

      <Popup
        title={"New Task"}
        isOpen={isPopupOpen}
        selectedCol={title}
        colTitle={colTitle}
        onSave={() => saveTask(assignedList.uid)}
        onClose={() => handleOpenPopup()}
        disableSaveButton={!isFormValid}
      >
        <AddNewTodoItem
          title={title}
          assignedList={assignedList}
          handleInputChange={handleInputChange}
          handleStatusChange={(value) => setNewTaskStatus(value)}
          onChange={handleCheckboxChange}
        />
      </Popup>
    </>
  );
}

export default TodoColumn;
