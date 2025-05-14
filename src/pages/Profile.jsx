import { useEffect } from "react";
import { Grid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import HeadingItem from "../components/mini-components/HeadingItem";
import ButtonItem from "../components/mini-components/ButtonItem";
import { LogoutIcon } from "../global/icons";
import { convertPx } from "../hooks/useConvertPx";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated]);

  return (
    <Grid w="100%" h="100%" placeContent="center" justify-items="stretch">
      <HeadingItem textAlign="center">Welcome back John!</HeadingItem>

      <ButtonItem
        variant="solid"
        mt={convertPx(20)}
        bg="themeColor"
        color="white"
        fontWeight="600"
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={convertPx(12)}
        onClick={handleLogout}
      >
        <LogoutIcon color="white" boxSize={convertPx(20)} />
        Log out
      </ButtonItem>
    </Grid>
  );
}
