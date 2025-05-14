import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Field, Fieldset, Stack, Text } from "@chakra-ui/react";
import InputField from "../components/mini-components/Inputfield";
import ButtonItem from "../components/mini-components/ButtonItem";
import LinkItem from "../components/mini-components/LinkItem";
import { useAuth } from "../contexts/AuthContext";
import { convertPx } from "../hooks/useConvertPx";

export default function Login() {
  const [isDisabled, setIsDisabled] = useState(true);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated, loginMessage } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userName != "" && password != "") {
      return setIsDisabled(false);
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
        setIsDisabled(true);
        navigate("/", { replace: true });
      }, 1000);
    } else {
      setIsDisabled(true);
    }
  }, [isAuthenticated, navigate]);

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
          Login
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
          <Field.Label>Name</Field.Label>
          <InputField
            h={convertPx(50)}
            type="text"
            placeholder="User name"
            name="name"
            value={userName}
            bg={isAuthenticated ? "statusGreenLight" : "white"}
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
            bg={isAuthenticated ? "statusGreenLight" : "white"}
            onChange={handleChangeValidation}
          />
        </Field.Root>
        {loginMessage && (
          <Text
            color={loginMessage && isAuthenticated ? "green" : "red"}
            fontSize={convertPx(12)}
            fontWeight="400"
            m="0"
            textAlign="center"
            width="100%"
          >
            {loginMessage}
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
        disabled={isDisabled}
        onClick={handleLogin}
      >
        Login
      </ButtonItem>

      <Text
        fontSize={convertPx(10)}
        fontWeight="600"
        color="secondaryColor"
        textAlign="center"
        height="fit-content"
      >
        Don't have an account?{" "}
        <LinkItem
          path={"/registering"}
          variant={"ghost"}
          color="themeColor"
          textAlign="center"
          height="fit-content"
        >
          Register here
        </LinkItem>
      </Text>
    </Fieldset.Root>
  );
}
