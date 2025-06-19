import { Table } from "@chakra-ui/react";
import { useGetAllUsers } from "../services/users";

function UserManagement() {
  const { data: users, isLoading } = useGetAllUsers();

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row background={"themeColor"}>
            <Table.ColumnHeader color={"white"} fontWeight={"600"}>
              First Name
            </Table.ColumnHeader>
            <Table.ColumnHeader color={"white"} fontWeight={"600"}>
              Last Name
            </Table.ColumnHeader>
            <Table.ColumnHeader color={"white"} fontWeight={"600"}>
              Email
            </Table.ColumnHeader>
            <Table.ColumnHeader color={"white"} fontWeight={"600"}>
              Birthday
            </Table.ColumnHeader>
            <Table.ColumnHeader color={"white"} fontWeight={"600"}>
              Role
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell>{item.first_name}</Table.Cell>
              <Table.Cell>{item.last_name}</Table.Cell>
              <Table.Cell>{item.email}</Table.Cell>
              <Table.Cell>{item.birthday}</Table.Cell>
              <Table.Cell>{item.user_type}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    );
  }
}

export default UserManagement;
