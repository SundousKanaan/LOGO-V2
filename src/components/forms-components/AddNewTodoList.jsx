import { HStack, Grid, Text, Avatar, Fieldset, Field } from "@chakra-ui/react";
import { convertPx } from "../../hooks/useConvertPx";
import { UsePickRandomColor } from "../../hooks/usePickRandomColor";
import InputField from "../mini-components/InputField";

function AddNewTodoList({
  user,
  handleInputChange,
  errorMessage,
  isProcessing,
}) {
  return (
    <>
      <Fieldset.Root>
        <Fieldset.Content>
          <Grid
            w={"100%"}
            columnGap={convertPx(20)}
            templateColumns={{
              base: `${convertPx(100)} 1fr`,
              sm: `${convertPx(150)} 1fr`,
            }}
          >
            <Text w={convertPx(150)}>List owner</Text>
            <HStack>
              <Avatar.Root
                size="xs"
                colorPalette={UsePickRandomColor(
                  user.first_name + user.last_name
                )}
              >
                <Avatar.Fallback />
                <Avatar.Image
                  src={user.photo}
                  alt={`${user.first_name} ${user.last_name} profile photo`}
                />
              </Avatar.Root>
              <Text>
                {user.first_name} {user.last_name}
              </Text>
            </HStack>
          </Grid>

          <Field.Root>
            <Grid
              w={"100%"}
              columnGap={convertPx(20)}
              templateColumns={{
                base: `${convertPx(100)} 1fr`,
                sm: `${convertPx(150)} 1fr`,
              }}
            >
              <Field.Label>List name*</Field.Label>
              <InputField
                w={"100%"}
                name="taskTitle"
                placeholder="Enter task name"
                h={"fit-content"}
                pt={convertPx(8)}
                pb={convertPx(8)}
                color="secondaryColor"
                borderColor={errorMessage ? "red" : "gray.300"}
                onChange={handleInputChange}
                disabled={isProcessing}
              />
              {errorMessage && (
                <Text
                  color="red"
                  fontSize={convertPx(12)}
                  fontWeight="400"
                  m="0"
                  width="100%"
                  gridColumnStart={1}
                  gridColumnEnd={3}
                >
                  {errorMessage.title
                    ? errorMessage.title
                    : "Something went wrong. Please try again later."}
                </Text>
              )}
            </Grid>
          </Field.Root>
        </Fieldset.Content>
      </Fieldset.Root>
    </>
  );
}

export default AddNewTodoList;
