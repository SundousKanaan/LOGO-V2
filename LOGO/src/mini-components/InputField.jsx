import { Input, Stack } from "@chakra-ui/react";

export default function InputField({
  type,
  placeholder,
  required,
  name,
  ...props
}) {
  return (
    <Input
      bg="white"
      _focusVisible={{ borderColor: "themeColor", borderWidth: "2px" }}
      _hover={{ borderColor: "themeColor", borderWidth: "2px" }}
      type={type}
      name={name}
      placeholder={placeholder}
      variant="subtle"
      required={required}
      {...props}
    />
  );
}
