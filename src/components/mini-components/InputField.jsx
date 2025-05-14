import { Input } from "@chakra-ui/react";
import { convertPx } from "../../hooks/useConvertPx";

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
      _focusVisible={{
        borderColor: "themeColor",
        borderWidth: convertPx(2),
      }}
      _hover={{
        borderColor: "themeColor",
        borderWidth: convertPx(2),
      }}
      type={type}
      name={name}
      placeholder={placeholder}
      variant="subtle"
      required={required}
      {...props}
    />
  );
}
