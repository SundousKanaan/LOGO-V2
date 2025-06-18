import {
  Flex,
  HStack,
  VStack,
  Spacer,
  Text,
  Icon,
  Avatar,
  AvatarGroup,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { UsePickRandomColor } from "../../hooks/usePickRandomColor";
import { convertPx } from "../../hooks/useConvertPx";
import { FaRegClock } from "react-icons/fa6";
import { MdUpdate, MdModeEdit } from "react-icons/md";

import HeadingItem from "./HeadingItem";
import Dropdown from "./Dropdown";
import ButtonItem from "./ButtonItem";

function TodoItem({
  data,
  handleDeleteItem,
  handleEditItem,
  handleStatusChange,
  isEditable,
}) {
  const status = createListCollection({
    items: [
      { label: "Todo", value: "pending" },
      { label: "Doing", value: "in_progress" },
      { label: "Done", value: "done" },
    ],
  });

  return (
    <>
      <Flex layerStyle="TodoItemLayout">
        <HStack
          borderBottom={
            data.description !== "" &&
            `${convertPx(1)} solid var(--chakra-colors-gray-200)`
          }
          pb={convertPx(8)}
          gap={convertPx(4)}
          alignItems={"start"}
        >
          <VStack alignItems="start">
            <HeadingItem fontSize={convertPx(16)} lineHeight={1.5}>
              {data.title}
            </HeadingItem>
            {/* status dropdown */}
            <Dropdown
              collection={status}
              defaultValue={data.status}
              handleChange={handleStatusChange}
              withIndicator={isEditable}
              fontWeight={600}
              bg={
                data.status === "pending"
                  ? "lightThemeColor"
                  : data.status === "in_progress"
                  ? "statusOrangeLight"
                  : "statusGreenLight"
              }
              color={
                data.status === "pending"
                  ? "themeColor"
                  : data.status === "in_progress"
                  ? "statusOrange"
                  : "statusGreen"
              }
              borderRadius={convertPx(4)}
              buttonProps={{ borderColor: "transparent" }}
            >
              {status.items.map((state, index) => (
                <Select.Item item={state} key={index}>
                  <Select.ItemText>{state.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Dropdown>
          </VStack>
          <Spacer />
          <ButtonItem
            variant="ghost"
            size="md"
            h={convertPx(30)}
            pl={convertPx(8)}
            pr={convertPx(8)}
            onClick={handleEditItem}
            display={isEditable ? "flex" : "none"}
          >
            <Icon as={MdModeEdit} color="secondaryColor" />
          </ButtonItem>
          <ButtonItem
            variant="ghost"
            size="md"
            h={convertPx(30)}
            pl={convertPx(8)}
            pr={convertPx(8)}
            onClick={handleDeleteItem}
            display={isEditable ? "flex" : "none"}
          >
            <Icon as={IoCloseCircleOutline} color="secondaryColor" />
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
            {data.assignee.map((assigneeUser, index) => (
              <Avatar.Root
                key={index}
                size={"2xs"}
                borderWidth={convertPx(2)}
                borderColor={"white"}
                colorPalette={UsePickRandomColor(`${assigneeUser?.first_name}`)}
              >
                <Avatar.Fallback
                  name={`${assigneeUser?.first_name} ${assigneeUser?.last_name}`}
                />
                <Avatar.Image
                  src={assigneeUser?.photo}
                  alt={`${assigneeUser?.first_name} ${assigneeUser?.last_name} profile photo`}
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

      {/* <Box>{renderPopupContent()}</Box> */}
    </>
  );
}

export default TodoItem;
