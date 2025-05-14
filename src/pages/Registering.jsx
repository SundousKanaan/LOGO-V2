import { useState } from "react";

import { Field, Fieldset, Stack, Text } from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";
import InputField from "../components/mini-components/Inputfield";
import ButtonItem from "../components/mini-components/ButtonItem";
import LinkItem from "../components/mini-components/LinkItem";

function Registering() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");
  const [isUserNameValid, setIsUserNameValid] = useState("none");
  const [isEmailValid, setIsEmailValid] = useState("none");
  const [isPasswordValid, setIsPasswordValid] = useState("none");

  const handleChangeValidation = (e) => {
    const { name, value } = e.target;

    setRegisterMessage("");
    setIsUserNameValid("none");
    setIsEmailValid("none");
    setIsPasswordValid("none");

    if (name === "name") {
      setUserName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleRegister = () => {
    // check the validity of the inputs
    const isValid_UserName = userName !== "" && /^[A-Za-z]+$/.test(userName);
    const isValid_Email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValid_Password = password.length >= 6 && /^\S+$/.test(password);
    let isPasswordsMatch = password === confirmPassword;

    // set the validity of the inputs
    setIsUserNameValid(isValid_UserName ? "true" : "false");
    setIsEmailValid(isValid_Email ? "true" : "false");
    if (!isPasswordsMatch) {
      setIsPasswordValid("false");
      setRegisterMessage("Passwords do not match");
      return;
    }
    setIsPasswordValid(isValid_Password ? "true" : "false");

    // show error messages according to the validity of the inputs
    if (!isValid_UserName || !isValid_Email || !isValid_Password) {
      if (!isValid_UserName && isValid_Email && isValid_Password) {
        setRegisterMessage("Invalid username");
      } else if (isValid_UserName && !isValid_Email && isValid_Password) {
        setRegisterMessage("Invalid email address");
      } else if (isValid_UserName && isValid_Email && !isValid_Password) {
        setRegisterMessage(
          "Password must be at least 6 characters and no spaces"
        );
      } else {
        setRegisterMessage("Please fill the fields correctly");
      }
      return;
    }

    // if all inputs are valid, register the user
    setRegisterMessage("");
    console.log("Registering user:", {
      userName,
      email,
      password,
    });
  };

  return (
    <Fieldset.Root
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={convertPx(20)}
      bg="lightGray"
    >
      <Stack>
        <Fieldset.Legend fontWeight="800" fontSize={convertPx(30)}>
          Sign up
        </Fieldset.Legend>
      </Stack>

      <Fieldset.Content
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={convertPx(20)}
        width={convertPx(350)}
      >
        <Field.Root>
          <Field.Label>Full name</Field.Label>
          <InputField
            h={convertPx(50)}
            type="text"
            placeholder="Example: JohnDoe"
            name="name"
            value={userName}
            bg="white"
            boxShadow={
              isUserNameValid === "false"
                ? "inset 0 0 0 1px var(--chakra-colors-status-red)"
                : isUserNameValid === "true"
                ? "inset 0 0 0 1px var(--chakra-colors-status-green)"
                : ""
            }
            onChange={handleChangeValidation}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Email</Field.Label>
          <InputField
            h={convertPx(50)}
            type="email"
            placeholder="Example: email.address@example.com"
            name="email"
            value={email}
            bg="white"
            boxShadow={
              isEmailValid === "false"
                ? "inset 0 0 0 1px var(--chakra-colors-status-red)"
                : isEmailValid === "true"
                ? "inset 0 0 0 1px var(--chakra-colors-status-green)"
                : ""
            }
            onChange={handleChangeValidation}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Password</Field.Label>
          <InputField
            h={convertPx(50)}
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            bg="white"
            boxShadow={
              isPasswordValid === "false"
                ? "inset 0 0 0 1px var(--chakra-colors-status-red)"
                : isPasswordValid === "true"
                ? "inset 0 0 0 1px var(--chakra-colors-status-green)"
                : ""
            }
            onChange={handleChangeValidation}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Confirm Password</Field.Label>
          <InputField
            h={convertPx(50)}
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            bg="white"
            boxShadow={
              isPasswordValid === "false"
                ? "inset 0 0 0 1px var(--chakra-colors-status-red)"
                : isPasswordValid === "true"
                ? "inset 0 0 0 1px var(--chakra-colors-status-green)"
                : ""
            }
            onChange={handleChangeValidation}
          />
        </Field.Root>
        {registerMessage !== "" && (
          <Text
            color="red"
            fontSize={convertPx(12)}
            fontWeight="400"
            m="0"
            textAlign="center"
            width="100%"
          >
            {registerMessage}
          </Text>
        )}
      </Fieldset.Content>

      <ButtonItem
        variant="solid"
        type="submit"
        width={convertPx(350)}
        height={convertPx(50)}
        gap={convertPx(12)}
        bg="themeColor"
        color="white"
        transition="all .5s"
        m="0"
        _hover={{ width: "100%" }}
        onClick={handleRegister}
        _active={{
          transform: "scale(0.9)",
          transition: "transform 0.2s",
        }}
      >
        Create account
      </ButtonItem>

      <Text
        fontSize={convertPx(10)}
        fontWeight="600"
        color="secondaryColor"
        textAlign="center"
        height="fit-content"
      >
        Already have an account?{" "}
        <LinkItem
          path={"/login"}
          variant={"ghost"}
          color="themeColor"
          textAlign="center"
          height="fit-content"
        >
          Login here
        </LinkItem>
      </Text>
    </Fieldset.Root>
  );
}

export default Registering;
