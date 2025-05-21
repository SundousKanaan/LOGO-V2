import { useState } from "react";
import { Field, Fieldset, Stack, Text, HStack } from "@chakra-ui/react";

import { convertPx } from "../hooks/useConvertPx";
import InputField from "../components/mini-components/Inputfield";
import ButtonItem from "../components/mini-components/ButtonItem";
import LinkItem from "../components/mini-components/LinkItem";
import { useAuth } from "../contexts/AuthContext";

function Registing() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");
  const [isUserNameValid, setIsUserNameValid] = useState("none");
  const [isEmailValid, setIsEmailValid] = useState("none");
  const [isPasswordValid, setIsPasswordValid] = useState("none");
  const [isBirthdayValid, setIsBirthdayValid] = useState("none");

  const { registerUser, errorMessage } = useAuth();

  const handleChangeValidation = (e) => {
    const { name, value } = e.target;

    setRegisterMessage("");
    setIsUserNameValid("none");
    setIsEmailValid("none");
    setIsPasswordValid("none");

    if (name === "firstName") {
      setFirstName(value);
    } else if (name === "lastName") {
      setLastName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else if (name === "birthday") {
      setBirthday(value);
    }
  };

  const handleRegister = async () => {
    // check the validity of the inputs
    const isValid_F_Name = firstName !== "" && /^[A-Za-z]+$/.test(firstName);
    const isValid_L_Name = lastName !== "" && /^[A-Za-z]+$/.test(lastName);
    const isValid_UserName = isValid_F_Name && isValid_L_Name;
    const isValid_Email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValid_Password = password.length >= 6 && /^\S+$/.test(password);
    const isPasswordsMatch = password === confirmPassword;

    // set the validity of the inputs
    setIsUserNameValid(isValid_UserName ? "true" : "false");
    setIsEmailValid(isValid_Email ? "true" : "false");
    if (!isPasswordsMatch) {
      setIsPasswordValid("false");
      setRegisterMessage("Passwords do not match");
      return;
    }
    setIsPasswordValid(isValid_Password ? "true" : "false");
    setIsBirthdayValid(birthday !== "" ? "true" : "false");

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
    try {
      // const userCredential = await registerUser(userName, email, password);
      await registerUser({ firstName, lastName, email, password, birthday });
      setRegisterMessage("");
      console.log("User registered successfully");
    } catch (error) {
      console.error("Error registering user:", error);
      setRegisterMessage("Error registering user");
    }
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
        <HStack>
          <Field.Root>
            <Field.Label>First name</Field.Label>
            <InputField
              h={convertPx(50)}
              type="text"
              placeholder="Example: John"
              name="firstName"
              value={firstName}
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
            <Field.Label>Last name</Field.Label>
            <InputField
              h={convertPx(50)}
              type="text"
              placeholder="Example: Doe"
              name="lastName"
              value={lastName}
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
        </HStack>

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
          <Field.Label>Birthday</Field.Label>
          <InputField
            h={convertPx(50)}
            type="date"
            placeholder="Birthday"
            name="birthday"
            value={birthday}
            bg="white"
            boxShadow={
              isBirthdayValid === "false"
                ? "inset 0 0 0 1px var(--chakra-colors-status-red)"
                : isBirthdayValid === "true"
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
        {errorMessage !== "" && (
          <Text
            color="red"
            fontSize={convertPx(12)}
            fontWeight="400"
            m="0"
            textAlign="center"
            width="100%"
          >
            {errorMessage}
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

export default Registing;
