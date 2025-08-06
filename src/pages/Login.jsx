import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Field, Fieldset, Stack, Text } from "@chakra-ui/react";

import InputField from "../components/mini-components/InputField";
import ButtonItem from "../components/mini-components/ButtonItem";
import LinkItem from "../components/mini-components/LinkItem";
import { useAuth } from "../contexts/AuthContext";
import { convertPx } from "../hooks/useConvertPx";
import { validateLoginLocally } from "../hooks/useLocalValidates";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    login,
    isAuthenticated,
    errorMessage: authLogingErrorMessage,
  } = useAuth();
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleChangeValidation = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    const localErrors = validateLoginLocally(email, password);
    if (localErrors) {
      setErrorMessage(localErrors);
      setLoading(false);
      return;
    }

    setErrorMessage(null);

    try {
      await login(email, password);
      setLoading(false);
    } catch (err) {
      setLoading(false);

      const error = err.response.data.errors;
      setErrorMessage(error);
      setTimeout(() => {
        setErrorMessage(null);
      }, "10000");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        setEmail("");
        setPassword("");
        navigate("/", { replace: true });
      }, 1000);
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
        <Fieldset.Legend
          fontWeight="800"
          fontSize={convertPx(30)}
          color="secondaryColor"
        >
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
          <Field.Label color="secondaryColor">Email</Field.Label>
          <InputField
            h={convertPx(50)}
            type="email"
            placeholder="Email address"
            name="email"
            value={email}
            bg={isAuthenticated ? "statusGreenLight" : "white"}
            color="secondaryColor"
            onChange={handleChangeValidation}
            borderColor={errorMessage?.email && "red"}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label color="secondaryColor">Password</Field.Label>
          <InputField
            h={convertPx(50)}
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            bg={isAuthenticated ? "statusGreenLight" : "white"}
            color="secondaryColor"
            onChange={handleChangeValidation}
            borderColor={errorMessage?.password && "red"}
          />
        </Field.Root>

        {errorMessage && (
          <Text
            color={"red"}
            fontSize={convertPx(12)}
            fontWeight="400"
            m="0"
            textAlign="center"
            width="100%"
          >
            {errorMessage.email ? errorMessage.email : errorMessage.password}
          </Text>
        )}
        {authLogingErrorMessage && (
          <Text
            color={"red"}
            fontSize={convertPx(12)}
            fontWeight="400"
            m="0"
            textAlign="center"
            width="100%"
          >
            {authLogingErrorMessage}
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
        onClick={handleLogin}
        isDisabled={loading}
      >
        {loading ? "Loading..." : "Login"}
      </ButtonItem>

      <Text
        fontSize={convertPx(12)}
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
