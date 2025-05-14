import { useState } from "react";
import { Input, IconButton } from "@chakra-ui/react";
import { convertPx } from "../../hooks/useConvertPx";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function InputField({
  type,
  placeholder,
  name,
  onChange,
  value,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Input
        bg="white"
        _focusVisible={{
          borderColor: "themeColor",
          borderWidth: convertPx(2),
        }}
        type={inputType}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant="subtle"
        w="100%"
        {...props}
      />
      {type === "password" && (
        <IconButton
          variant="ghost"
          position="absolute"
          right={1}
          top="50%"
          transform="translateY(-50%)"
          bg="transparent"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </IconButton>
      )}
    </div>
  );
}
