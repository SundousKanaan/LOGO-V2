import {
  Fieldset,
  Field,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { useAuth } from "../../contexts/AuthContext";
import { convertPx } from "../../hooks/useConvertPx";
import InputField from "../mini-components/InputField";
import Dropdown from "../mini-components/Dropdown";

function EditeUser({ user, errorState, handleRoleChange, handleInputChange }) {
  const { currentUser } = useAuth();
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
                errorState?.type === "first_name"
                  ? "inset 0 0 0 1px var(--chakra-colors-status-red)"
                  : "inset 0 0 0 1px var(--chakra-colors-status-green)"
              }
              onChange={handleInputChange}
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
                errorState?.type === "last_name"
                  ? "inset 0 0 0 1px var(--chakra-colors-status-red)"
                  : "inset 0 0 0 1px var(--chakra-colors-status-green)"
              }
              onChange={handleInputChange}
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
              type="tel"
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
              onChange={handleInputChange}
            />
          </Field.Root>

          <Field.Root
            display="flex"
            flexDirection="row"
            gap={convertPx(20)}
            w="100%"
          >
            <Field.Label w={convertPx(120)} color="secondaryColor">
              Birthday
            </Field.Label>
            <InputField
              required
              h={convertPx(50)}
              type="date"
              name="birthday"
              defaultValue={user.birthday}
              placeholder={"Birthday: YYYY-MM-DD"}
              bg="white"
              color="secondaryColor"
              boxShadow={
                errorState?.type === "birthday"
                  ? "inset 0 0 0 1px var(--chakra-colors-status-red)"
                  : "inset 0 0 0 1px var(--chakra-colors-status-green)"
              }
              onChange={handleInputChange}
            />
          </Field.Root>

          {currentUser?.user_type === "admin" && (
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
          )}
        </Fieldset.Content>
      )}
    </Fieldset.Root>
  );
}

export default EditeUser;
