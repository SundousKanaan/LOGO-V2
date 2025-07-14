import { useEffect, useState } from "react";
import {
  Flex,
  HStack,
  Skeleton,
  Spacer,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";
import ButtonItem from "./mini-components/ButtonItem";
import Dropdown from "./mini-components/Dropdown";

function ListsActions({
  isLoading,
  isEditable,
  isAuthenticated,
  onEdit,
  onDelete,
  onCreate,
  allTodoLists,
  selectedList,
  onListchange,
}) {
  const [dropdownCollection, setDropdownCollection] = useState(null);

  // Create dropdown collection for lists
  useEffect(() => {
    if (isLoading) return;

    if (!allTodoLists || allTodoLists.length === 0) {
      setDropdownCollection(null);
      return;
    }

    const dropdownCollection = createListCollection({
      items: allTodoLists.map((item) => ({
        label: item.title,
        value: item.id,
      })),
    });
    setDropdownCollection(dropdownCollection);
  }, [allTodoLists, isLoading]);

  const RenderListsDropdown = () => {
    return (
      <Dropdown
        disabled={dropdownCollection ? false : true}
        collection={dropdownCollection ? dropdownCollection : null}
        // defaultValue={selectedList?.id} // todo: fix this
        placeholder={selectedList ? selectedList.title : "No lists available"}
        handleChange={onListchange}
        withIndicator
        height={convertPx(40)}
        width={{ base: "100%", lg: convertPx(400) }}
        bg="white"
        color="secondaryColor"
        borderRadius={convertPx(4)}
        buttonProps={{
          height: "100%",
          border: "none",
        }}
      >
        {dropdownCollection?.items?.map((list) => (
          <Select.Item
            item={list}
            key={list.value}
            flex={"none"}
            h={convertPx(60)}
            cursor={"pointer"}
            borderBottom={`${convertPx(
              3
            )} solid var(--chakra-colors-theme-color)`}
          >
            <Select.ItemText>{list.label}</Select.ItemText>
          </Select.Item>
        ))}
      </Dropdown>
    );
  };

  return (
    <Flex
      w="100%"
      flexDirection={{ base: "column", lg: "row" }}
      placeContent="center"
      justifyContent="start"
      gap={convertPx(20)}
      mb={convertPx(16)}
    >
      <Skeleton
        loading={isLoading}
        h={convertPx(40)}
        w={{ base: "100%", lg: convertPx(400) }}
      >
        <RenderListsDropdown />
      </Skeleton>

      <Spacer display={{ base: "none", lg: "block" }} />
      <Skeleton loading={isLoading && allTodoLists}>
        <HStack>
          <ButtonItem
            bg="themeColor"
            color="white"
            flexGrow={1}
            onClick={onEdit}
            display={isEditable ? "flex" : "none"}
          >
            Edit list
          </ButtonItem>
          <ButtonItem
            bg="redColor"
            color="white"
            flexGrow={1}
            onClick={onDelete}
            display={isEditable ? "flex" : "none"}
          >
            Delete list
          </ButtonItem>
          <ButtonItem
            bg="themeColor"
            color="white"
            flexGrow={1}
            onClick={onCreate}
            disabled={!isAuthenticated}
          >
            Create list
          </ButtonItem>
        </HStack>
      </Skeleton>
    </Flex>
  );
}

export default ListsActions;
