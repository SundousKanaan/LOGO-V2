import {
  HStack,
  Fieldset,
  Field,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { convertPx } from "../../hooks/useConvertPx";
import InputField from "../mini-components/InputField";
import Dropdown from "../mini-components/Dropdown";

function EditeUser({ user, errorState, handleRoleChange, handleChangeName }) {
  const roleCollection = createListCollection({
    items: [
      { value: "admin", label: "Admin" },
      { value: "user", label: "User" },
    ],
  });

  return (
    <Fieldset.Root display="flex" flexDirection="column" alignItems="center">
      {user && (
        <Fieldset.Content
          display="flex"
          flexDirection="column"
          alignItems="center"
          // width={convertPx(350)}
        >
          <Field.Root
            display="flex"
            flexDirection="row"
            gap={convertPx(20)}
            w="100%"
          >
            <Field.Label color="secondaryColor" w={convertPx(120)}>
              First name
            </Field.Label>
            <InputField
              h={convertPx(50)}
              type="text"
              name="firstName"
              defaultValue={user.first_name}
              bg="white"
              color="secondaryColor"
              boxShadow={
                errorState?.type === "name"
                  ? "inset 0 0 0 1px var(--chakra-colors-status-red)"
                  : "inset 0 0 0 1px var(--chakra-colors-status-green)"
              }
              onChange={handleChangeName}
            />
          </Field.Root>

          <Field.Root
            display="flex"
            flexDirection="row"
            gap={convertPx(20)}
            w="100%"
          >
            <Field.Label w={convertPx(120)} color="secondaryColor">
              Last name
            </Field.Label>
            <InputField
              h={convertPx(50)}
              type="text"
              name="lastName"
              defaultValue={user.last_name}
              bg="white"
              color="secondaryColor"
              boxShadow={
                errorState?.type === "name"
                  ? "inset 0 0 0 1px var(--chakra-colors-status-red)"
                  : "inset 0 0 0 1px var(--chakra-colors-status-green)"
              }
              onChange={handleChangeName}
            />
          </Field.Root>

          <Field.Root
            display="flex"
            flexDirection="row"
            gap={convertPx(20)}
            w="100%"
          >
            <Field.Label w={convertPx(120)} color="secondaryColor">
              Phone
            </Field.Label>
            <InputField
              h={convertPx(50)}
              type="text"
              name="phone"
              defaultValue={user.phone}
              placeholder={"Phone: +31612345678"}
              bg="white"
              color="secondaryColor"
              boxShadow={
                errorState?.type === "phone"
                  ? "inset 0 0 0 1px var(--chakra-colors-status-red)"
                  : "inset 0 0 0 1px var(--chakra-colors-status-green)"
              }
              onChange={handleChangeName}
            />
          </Field.Root>

          <Field.Root
            display="flex"
            flexDirection="row"
            gap={convertPx(20)}
            w="100%"
            h={convertPx(50)}
          >
            <Field.Label w={convertPx(120)} color="secondaryColor">
              Role
            </Field.Label>
            <Dropdown
              collection={roleCollection}
              defaultValue={user.user_type}
              withIndicator
              handleChange={handleRoleChange}
              h={convertPx(50)}
              w="100%"
            >
              {roleCollection.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  <Select.ItemText>{item.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Dropdown>
          </Field.Root>
        </Fieldset.Content>
      )}
    </Fieldset.Root>
  );
}

export default EditeUser;
