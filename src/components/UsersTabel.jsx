import { Table, Icon, Skeleton, Avatar, HStack } from "@chakra-ui/react";
import { MdModeEdit, MdOutlineDeleteForever } from "react-icons/md";
import { UsePickRandomColor } from "../hooks/usePickRandomColor";
import { convertPx } from "../hooks/useConvertPx";
import ButtonItem from "./mini-components/ButtonItem";

export default function UsersTable({
  data,
  canBeUpdated,
  isDataLoading,
  isDataFetched,
  selectedId,
  isUpdating,
  isDeleting,
  onEdit,
  onDelete,
}) {
  return (
    <Table.Root size="sm">
      <Table.Header>
        <Table.Row background={"themeColor"} borderRadius={"md"}>
          <Table.ColumnHeader></Table.ColumnHeader>
          {canBeUpdated && (
            <Table.ColumnHeader
              color={"white"}
              fontWeight={"600"}
              textAlign={"center"}
            >
              Actions
            </Table.ColumnHeader>
          )}
          <Table.ColumnHeader color={"white"} fontWeight={"600"}>
            Avatar
          </Table.ColumnHeader>
          <Table.ColumnHeader
            color={"white"}
            fontWeight={"600"}
            textWrap={"nowrap"}
          >
            First Name
          </Table.ColumnHeader>
          <Table.ColumnHeader
            color={"white"}
            fontWeight={"600"}
            textWrap={"nowrap"}
          >
            Last Name
          </Table.ColumnHeader>
          <Table.ColumnHeader
            color={"white"}
            fontWeight={"600"}
            textWrap={"nowrap"}
          >
            Email
          </Table.ColumnHeader>
          <Table.ColumnHeader
            color={"white"}
            fontWeight={"600"}
            textWrap={"nowrap"}
          >
            Birthday
          </Table.ColumnHeader>
          <Table.ColumnHeader color={"white"} fontWeight={"600"}>
            Role
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {isDataLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <Table.Row h={convertPx(60)} key={i}>
                <Table.Cell colSpan={8}>
                  <Skeleton h={convertPx(60)} w={"100%"}></Skeleton>
                </Table.Cell>
              </Table.Row>
            ))
          : isDataFetched &&
            data &&
            data.map((user, index) => (
              <Table.Row
                key={index}
                h={convertPx(60)}
                bg="white"
                color="secondaryColor"
                opacity={
                  user.id === selectedId && (isUpdating || isDeleting) && 0.5
                }
              >
                <Table.Cell pl={convertPx(24)}>{index + 1}</Table.Cell>

                {canBeUpdated && (
                  <Table.Cell width={convertPx(70)}>
                    <HStack gap={0}>
                      <ButtonItem
                        variant="solid"
                        size="md"
                        h={convertPx(30)}
                        p={convertPx(8)}
                        pr={convertPx(8)}
                        bg="transparent"
                        onClick={() => onEdit(user)}
                        _hover={{
                          boxShadow:
                            " inset 0 0 0 0.06em var(--chakra-colors-theme-color)",
                        }}
                      >
                        <Icon as={MdModeEdit} color="secondaryColor" />
                      </ButtonItem>
                      <ButtonItem
                        variant="solid"
                        size="md"
                        h={convertPx(30)}
                        p={convertPx(8)}
                        pr={convertPx(8)}
                        bg="transparent"
                        onClick={() => onDelete(user)}
                        _hover={{
                          boxShadow:
                            " inset 0 0 0 0.06em var(--chakra-colors-theme-color)",
                        }}
                      >
                        <Icon
                          as={MdOutlineDeleteForever}
                          color="secondaryColor"
                        />
                      </ButtonItem>
                    </HStack>
                  </Table.Cell>
                )}
                <Table.Cell>
                  <Avatar.Root
                    size="sm"
                    colorPalette={UsePickRandomColor(
                      `${user.first_name} ${user.last_name}`
                    )}
                  >
                    <Avatar.Fallback
                      name={`${user.first_name} ${user.last_name}`}
                    />
                    <Avatar.Image
                      src={user?.photo}
                      alt={`${user?.first_name} ${user?.last_name} profile photo`}
                    />
                  </Avatar.Root>
                </Table.Cell>
                <Table.Cell textWrap={"nowrap"} textTransform={"capitalize"}>
                  {user.first_name}
                </Table.Cell>
                <Table.Cell textWrap={"nowrap"} textTransform={"capitalize"}>
                  {user.last_name}
                </Table.Cell>
                <Table.Cell textWrap={"nowrap"}>{user.email}</Table.Cell>
                <Table.Cell textWrap={"nowrap"}>{user.birthday}</Table.Cell>
                <Table.Cell textWrap={"nowrap"} textTransform={"capitalize"}>
                  {user.user_type}
                </Table.Cell>
              </Table.Row>
            ))}
      </Table.Body>
    </Table.Root>
  );
}
