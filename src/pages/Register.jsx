import { useState } from "react";
import { Field, Fieldset, Stack, Text, HStack } from "@chakra-ui/react";

import { convertPx } from "../hooks/useConvertPx";
import InputField from "../components/mini-components/InputField";
import ButtonItem from "../components/mini-components/ButtonItem";
import LinkItem from "../components/mini-components/LinkItem";
import { useAuth } from "../contexts/AuthContext";
// import { useValidateProfile } from "../hooks/useUserHooks.jsx";
import { validateUserDataLocally } from "../hooks/useLocalValidates.jsx";

function Registing() {
  const { signUp, errorMessage, isProcessing } = useAuth();

  // const validateProfile = useValidateProfile();
  const accountMap = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthday: "",
    phone: "",
  };
  const [accountData, setAccountData] = useState(accountMap);
  const [registerErrorMessage, setRegisterErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // handelers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountData((prevData) => ({
      ...prevData,
      [name]: value.trim(),
    }));
  };

  const handleRegister = async () => {
    setLoading(true);
    const localerrors = validateUserDataLocally(accountData);
    if (localerrors) {
      setRegisterErrorMessage(localerrors);
      setLoading(false);
      return;
    }

    try {
      await signUp(accountData);
      setRegisterErrorMessage(null);
      setLoading(false);
    } catch (e) {
      setLoading(false);

      const error = e.response.data.errors;
      setRegisterErrorMessage(error);
      setTimeout(() => {
        setRegisterErrorMessage(null);
      }, "10000");
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
            <Field.Label color="secondaryColor">First name*</Field.Label>
            <InputField
              h={convertPx(50)}
              type="text"
              placeholder="Example: John"
              name="first_name"
              bg="white"
              color="secondaryColor"
              borderColor={
                (registerErrorMessage?.first_name ||
                  errorMessage?.first_name) &&
                "red"
              }
              onChange={handleInputChange}
            />
            <Text
              color="red"
              fontSize={convertPx(12)}
              fontWeight="400"
              m="0"
              width="100%"
              position="absolute"
              bottom={"-1.5em"}
            >
              {registerErrorMessage?.first_name || errorMessage?.first_name}
            </Text>
          </Field.Root>

          <Field.Root>
            <Field.Label color="secondaryColor">Last name*</Field.Label>
            <InputField
              h={convertPx(50)}
              type="text"
              placeholder="Example: Doe"
              name="last_name"
              bg="white"
              color="secondaryColor"
              borderColor={
                (registerErrorMessage?.last_name || errorMessage?.last_name) &&
                "red"
              }
              onChange={handleInputChange}
            />
            <Text
              color="red"
              fontSize={convertPx(12)}
              fontWeight="400"
              m="0"
              width="100%"
              position="absolute"
              bottom={"-1.5em"}
            >
              {registerErrorMessage?.last_name || errorMessage?.last_name}
            </Text>
          </Field.Root>
        </HStack>

        <Field.Root>
          <Field.Label color="secondaryColor">Email*</Field.Label>
          <InputField
            h={convertPx(50)}
            type="email"
            placeholder="Example: email.address@example.com"
            name="email"
            bg="white"
            color="secondaryColor"
            borderColor={
              (registerErrorMessage?.email || errorMessage?.email) && "red"
            }
            onChange={handleInputChange}
          />
          <Text
            color="red"
            fontSize={convertPx(12)}
            fontWeight="400"
            m="0"
            width="100%"
            position="absolute"
            bottom={"-1.5em"}
          >
            {registerErrorMessage?.email || errorMessage?.email}
          </Text>
        </Field.Root>

        <Field.Root>
          <Field.Label color="secondaryColor">Phone</Field.Label>
          <InputField
            h={convertPx(50)}
            type="tel"
            placeholder="Example: +31 123456789"
            name="phone"
            bg="white"
            color="secondaryColor"
            borderColor={
              (registerErrorMessage?.phone || errorMessage?.phone) && "red"
            }
            onChange={handleInputChange}
          />
          <Text
            color="red"
            fontSize={convertPx(12)}
            fontWeight="400"
            m="0"
            width="100%"
            position="absolute"
            bottom={"-1.5em"}
          >
            {registerErrorMessage?.phone || errorMessage?.phone}
          </Text>
        </Field.Root>

        <Field.Root>
          <Field.Label color="secondaryColor">Birthday*</Field.Label>
          <InputField
            h={convertPx(50)}
            type="date"
            placeholder="Birthday"
            name="birthday"
            bg="white"
            color="secondaryColor"
            borderColor={
              (registerErrorMessage?.birthday || errorMessage?.birthday) &&
              "red"
            }
            onChange={handleInputChange}
          />
          <Text
            color="red"
            fontSize={convertPx(12)}
            fontWeight="400"
            m="0"
            width="100%"
            position="absolute"
            bottom={"-1.5em"}
          >
            {registerErrorMessage?.birthday || errorMessage?.birthday}
          </Text>
        </Field.Root>

        <Field.Root>
          <Field.Label color="secondaryColor">Password*</Field.Label>
          <InputField
            h={convertPx(50)}
            type="password"
            placeholder="Password"
            name="password"
            bg="white"
            color="secondaryColor"
            borderColor={
              (registerErrorMessage?.password ||
                registerErrorMessage?.confirmPassword ||
                errorMessage?.password) &&
              "red"
            }
            onChange={handleInputChange}
          />
          <Text
            color="red"
            fontSize={convertPx(12)}
            fontWeight="400"
            m="0"
            width="100%"
            position="absolute"
            bottom={"-1.5em"}
          >
            {registerErrorMessage?.password || errorMessage?.password}
          </Text>
        </Field.Root>
        <Field.Root>
          <Field.Label color="secondaryColor">Confirm Password*</Field.Label>
          <InputField
            h={convertPx(50)}
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            bg="white"
            color="secondaryColor"
            borderColor={
              (registerErrorMessage?.password ||
                registerErrorMessage?.confirmPassword ||
                errorMessage?.password) &&
              "red"
            }
            onChange={handleInputChange}
          />
          <Text
            color="red"
            fontSize={convertPx(12)}
            fontWeight="400"
            m="0"
            width="100%"
            position="absolute"
            bottom={"-1.5em"}
          >
            {registerErrorMessage?.confirmPassword}
          </Text>
        </Field.Root>

        <Text
          color="red"
          fontSize={convertPx(12)}
          fontWeight="400"
          m="0"
          textAlign="center"
          width="100%"
        >
          {registerErrorMessage?.message}
        </Text>

        {errorMessage?.message && (
          <Text
            color="red"
            fontSize={convertPx(12)}
            fontWeight="400"
            m="0"
            textAlign="center"
            width="100%"
          >
            {errorMessage.message}
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
        isDisabled={loading}
      >
        {loading ? "Creating..." : "Create account"}
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
