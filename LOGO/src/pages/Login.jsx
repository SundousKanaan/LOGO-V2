import { useEffect, useState } from "react";
import { Box, Heading, Field, Fieldset, Stack, Text } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import InputField from "../components/mini-components/Inputfield";
import ButtonItem from "../components/mini-components/ButtonItem";
import { useNavigator } from "../contexts/navigatorContext";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { navigateTO } = useNavigator();
  const [isDisabledLogin, setIsDisabledLogin] = useState(true);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated, loginMessage } = useAuth();

  useEffect(() => {
    if (userName != "" && password != "") {
      return setIsDisabledLogin(false);
    }
  }, [userName, password]);

  const handleChangeValidation = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setUserName(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  };

  const handleLogin = () => {
    login(userName, password);
  };

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        setUserName("");
        setPassword("");
        setIsDisabledLogin(true);
        navigateTO("/");
      }, 1000);
    } else {
      setIsDisabledLogin(true);
    }
  }, [isAuthenticated]);

  return (
    <Fieldset.Root
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="20px"
      bg="lightGray"
    >
      <Stack>
        <Fieldset.Legend fontWeight="800" fontSize="30px">
          Login
        </Fieldset.Legend>
      </Stack>

      <Fieldset.Content
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="20px"
        width="350px"
      >
        <Field.Root>
          <Field.Label>Name:</Field.Label>
          <InputField
            h="50px"
            type="text"
            placeholder="User name"
            name="name"
            value={userName}
            bg={isAuthenticated ? "statusGreenLight" : "white"}
            onChange={handleChangeValidation}
            required
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Password:</Field.Label>
          <InputField
            h="50px"
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            bg={isAuthenticated ? "statusGreenLight" : "white"}
            onChange={handleChangeValidation}
            required
          />
        </Field.Root>
        {loginMessage && (
          <Text
            color={loginMessage && isAuthenticated ? "green" : "red"}
            fontSize="14px"
            fontWeight="600"
            m="0"
            textAlign="center"
            width="350px"
          >
            {loginMessage}
          </Text>
        )}
      </Fieldset.Content>

      <ButtonItem
        variant="solid"
        type="submit"
        width="350px"
        height="50px"
        gap="12px"
        bg="themeColor"
        color="white"
        transition="all .5s"
        m="0"
        _hover={{ width: "100%" }}
        disabled={isDisabledLogin}
        onClick={handleLogin}
      >
        Login
      </ButtonItem>
    </Fieldset.Root>
  );
}
