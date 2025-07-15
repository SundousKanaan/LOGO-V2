import { Skeleton } from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";
import TodoList from "./mini-components/TodoList";
import TodoColumn from "./mini-components/TodoColumn";
import TodoItem from "./mini-components/TodoItem";

function TodoBoard({
  isLoading,
  isFetched,
  listDetails,
  isEditable,
  handleEditListItem,
  openCreateItemPopup,
  setOpenItemPopup,
}) {
  if (isLoading) {
    return (
      <TodoList>
        {["pending", "in_progress", "done"].map((_, index) => (
          <Skeleton
            loading={true}
            key={index}
            h={convertPx(350)}
            minW={convertPx(300)}
            flexGrow={{ base: 0, md: 1 }}
          />
        ))}
      </TodoList>
    );
  }
  if (isFetched && !listDetails) return null;

  return (
    <>
      <h1>{listDetails?.id}</h1>
      <TodoList>
        {["pending", "in_progress", "done"].map((colTitle) => (
          <TodoColumn
            key={colTitle}
            title={colTitle}
            count={
              (
                listDetails?.items?.filter(
                  (item) => item?.status === colTitle
                ) || []
              ).length
            }
            handleOpenPopup={() => openCreateItemPopup(colTitle)}
            isEditable={isEditable}
            opacity={String(listDetails?.id).startsWith("temp-") ? 0.5 : 1}
          >
            {listDetails?.items
              ?.filter((item) => item && item.status === colTitle)
              .map((item) => (
                <TodoItem
                  key={item.id}
                  data={item}
                  isEditable={isEditable}
                  isTemporary={String(item.id).startsWith("temp-")}
                  handleDeleteItem={() =>
                    setOpenItemPopup({
                      case: "delete",
                      title: item.title,
                      id: item.id,
                    })
                  }
                  handleEditItem={() =>
                    setOpenItemPopup({
                      case: "edit",
                      title: item.title,
                      id: item.id,
                    })
                  }
                  handleStatusChange={(newStatus) => {
                    handleEditListItem({
                      ...item,
                      assignee: item.assignee,
                      status: newStatus["value"][0],
                    });
                  }}
                />
              ))}
          </TodoColumn>
        ))}
      </TodoList>
    </>
  );
}

export default TodoBoard;
