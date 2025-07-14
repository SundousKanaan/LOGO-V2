import { useState, useEffect } from "react";
import { Field, Fieldset, Stack, Text, HStack } from "@chakra-ui/react";

import { convertPx } from "../hooks/useConvertPx";
import InputField from "../components/mini-components/InputField";
import ButtonItem from "../components/mini-components/ButtonItem";
import LinkItem from "../components/mini-components/LinkItem";
import { useAuth } from "../contexts/AuthContext";
import { useValidateProfile } from "../hooks/useUserHooks.jsx";

function Registing() {
  const [registerErrorMessage, setRegisterErrorMessage] = useState(null);

  const [accountData, setAccountData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    birthday: "",
  });
  const { signUp, errorMessage, isProcessing } = useAuth();
  const [passwordValue, setPasswordValue] = useState(null);
  const [confirmPasswordValue, setConfirmPasswordValue] = useState(null);

  const validateProfile = useValidateProfile();

  // handelers
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "firstName") {
      setAccountData((prevData) => ({
        ...prevData,
        first_name: value,
      }));
    } else if (name === "lastName") {
      setAccountData((prevData) => ({
        ...prevData,
        last_name: value,
      }));
    } else if (name === "email") {
      setAccountData((prevData) => ({
        ...prevData,
        email: value,
      }));
    } else if (name === "birthday") {
      setAccountData((prevData) => ({
        ...prevData,
        birthday: value,
      }));
    } else if (name === "password") {
      setPasswordValue(value);
    } else if (name === "confirmPassword") {
      setConfirmPasswordValue(value);
    }
  };

  useEffect(() => {
    if (passwordValue && confirmPasswordValue) {
      if (passwordValue !== confirmPasswordValue) {
        setRegisterErrorMessage({
          type: "password",
          message: "Passwords do not match",
        });
      } else {
        setRegisterErrorMessage(null);
        setAccountData((prevData) => ({
          ...prevData,
          password: passwordValue,
        }));
      }
    }
  }, [passwordValue, confirmPasswordValue]);

  const handleRegister = async () => {
    validateProfile.mutate(accountData, {
      onSuccess: async () => {
        await signUp(accountData);
        setRegisterErrorMessage(null);
      },

      onError: (err) => {
        const error = err.response.data.errors;
        if (error.first_name || error.last_name) {
          setRegisterErrorMessage({
            type: error.first_name?.[0] ? "first_name" : "last_name",
            message: error.first_name?.[0] || error.last_name?.[0],
          });
        } else if (error.phone) {
          setRegisterErrorMessage({
            type: "phone",
            message: error.phone[0],
          });
        } else if (error.birthday) {
          setRegisterErrorMessage({
            type: "birthday",
            message: error.birthday[0],
          });
        } else if (error.email) {
          setRegisterErrorMessage({
            type: "email",
            message: error.email[0] || "Invalid email",
          });
        } else {
          setRegisterErrorMessage({
            type: "general",
            message: "Registration failed. Please try again.",
          });
        }
      },
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
      disabled={isProcessing}
    >
      <Stack>
        <Fieldset.Legend
          fontWeight="800"
          fontSize={convertPx(30)}
          color="secondaryColor"
        >
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
            <Field.Label color="secondaryColor">First name</Field.Label>
            <InputField
              h={convertPx(50)}
              type="text"
              placeholder="Example: John"
              name="firstName"
              bg="white"
              color="secondaryColor"
              boxShadow={
                !registerErrorMessage
                  ? ""
                  : registerErrorMessage?.type === "first_name"
                  ? "inset 0 0 0 1px var(--chakra-colors-status-red)"
                  : "inset 0 0 0 1px var(--chakra-colors-status-green)"
              }
              onChange={handleInputChange}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label color="secondaryColor">Last name</Field.Label>
            <InputField
              h={convertPx(50)}
              type="text"
              placeholder="Example: Doe"
              name="lastName"
              bg="white"
              color="secondaryColor"
              boxShadow={
                !registerErrorMessage
                  ? ""
                  : registerErrorMessage?.type === "last_name"
                  ? "inset 0 0 0 1px var(--chakra-colors-status-red)"
                  : "inset 0 0 0 1px var(--chakra-colors-status-green)"
              }
              onChange={handleInputChange}
            />
          </Field.Root>
        </HStack>

        <Field.Root>
          <Field.Label color="secondaryColor">Email</Field.Label>
          <InputField
            h={convertPx(50)}
            type="email"
            placeholder="Example: email.address@example.com"
            name="email"
            bg="white"
            color="secondaryColor"
            boxShadow={
              !registerErrorMessage
                ? ""
                : registerErrorMessage?.type === "email"
                ? "inset 0 0 0 1px var(--chakra-colors-status-red)"
                : "inset 0 0 0 1px var(--chakra-colors-status-green)"
            }
            onChange={handleInputChange}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label color="secondaryColor">Birthday</Field.Label>
          <InputField
            h={convertPx(50)}
            type="date"
            placeholder="Birthday"
            name="birthday"
            bg="white"
            color="secondaryColor"
            boxShadow={
              !registerErrorMessage
                ? ""
                : registerErrorMessage?.type === "birthday"
                ? "inset 0 0 0 1px var(--chakra-colors-status-red)"
                : "inset 0 0 0 1px var(--chakra-colors-status-green)"
            }
            onChange={handleInputChange}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label color="secondaryColor">Password</Field.Label>
          <InputField
            h={convertPx(50)}
            type="password"
            placeholder="Password"
            name="password"
            bg="white"
            color="secondaryColor"
            boxShadow={
              !registerErrorMessage
                ? ""
                : registerErrorMessage?.type === "password"
                ? "inset 0 0 0 1px var(--chakra-colors-status-red)"
                : "inset 0 0 0 1px var(--chakra-colors-status-green)"
            }
            onChange={handleInputChange}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label color="secondaryColor">Confirm Password</Field.Label>
          <InputField
            h={convertPx(50)}
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            bg="white"
            color="secondaryColor"
            boxShadow={
              !registerErrorMessage
                ? ""
                : registerErrorMessage?.type === "password"
                ? "inset 0 0 0 1px var(--chakra-colors-status-red)"
                : "inset 0 0 0 1px var(--chakra-colors-status-green)"
            }
            onChange={handleInputChange}
          />
        </Field.Root>
        {registerErrorMessage && (
          <Text
            color="red"
            fontSize={convertPx(12)}
            fontWeight="400"
            m="0"
            textAlign="center"
            width="100%"
          >
            {registerErrorMessage.message}
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
        _hover={{ transform: "scale(1.05)" }}
        onClick={handleRegister}
        _active={{
          transform: "scale(0.9)",
          transition: "transform 0.2s",
        }}
      >
        Create account
      </ButtonItem>

      <Text
        fontSize={convertPx(12)}
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
