import { HStack, Text, Avatar, Fieldset, Field } from "@chakra-ui/react";
import { convertPx } from "../../hooks/useConvertPx";
import { UsePickRandomColor } from "../../hooks/usePickRandomColor";
import InputField from "../mini-components/InputField";

function AddNewTodoList({ user, handleInputChange }) {
  return (
    <>
      <Fieldset.Root>
        <Fieldset.Content>
          <HStack gap={convertPx(20)}>
            <Text w={convertPx(150)}>List owner</Text>
            <HStack>
              <Avatar.Root
                size="xs"
                colorPalette={UsePickRandomColor(user.displayName)}
              >
                <Avatar.Fallback />
                <Avatar.Image
                  src={user.photo}
                  alt={`${user.displayName} profile photo`}
                />
              </Avatar.Root>
              <Text>{user.displayName}</Text>
            </HStack>
          </HStack>

          <Field.Root>
            <HStack gap={convertPx(20)} align={"start"}>
              <Field.Label w={convertPx(230)}>List name</Field.Label>
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
        </Fieldset.Content>
      </Fieldset.Root>
    </>
  );
}

export default AddNewTodoList;
