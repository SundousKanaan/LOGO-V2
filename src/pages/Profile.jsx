import { useEffect, useState } from "react";
import { Flex, Spacer } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LogoutIcon } from "../global/icons";
import { useAuth } from "../contexts/AuthContext";
import { convertPx } from "../hooks/useConvertPx";
import { useTodolists } from "../services/getTodolists";
import ButtonItem from "../components/mini-components/ButtonItem";
import HeadingItem from "../components/mini-components/HeadingItem";
import TodoList from "../components/TodoList";
import RadioButtons from "../components/mini-components/RadioButtons";

export default function Profile() {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: todoList, isLoading } = useTodolists();
  const [listData, setListData] = useState([]);
  const [showedList, setShowedList] = useState("");

  useEffect(() => {
    if (isLoading) {
      return;
    }
    setListData(todoList);
  }, [todoList, isLoading]);

  useEffect(() => {
    if (todoList?.length > 0 && showedList === "") {
      setShowedList(todoList[0].id);
    }
  }, [todoList, showedList]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
  };

  function handleChangeList(value) {
    setShowedList(value);
  }

  return (
    <>
      <Flex
        w="100%"
        h={convertPx(40)}
        placeContent="center"
        justify-items="stretch"
        rowGap={convertPx(20)}
        mb={convertPx(16)}
      >
        <HeadingItem
          textAlign="left"
          lineHeight={convertPx(40)}
          fontSize={{ base: convertPx(18), lg: convertPx(24) }}
        >
          Welcome back {currentUser?.firstName}!
        </HeadingItem>
        <Spacer />
        <ButtonItem
          variant="solid"
          w={{ base: convertPx(150), lg: convertPx(200) }}
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
      </Flex>

      {isLoading ? (
        <h1>loading..</h1>
      ) : listData?.length > 0 ? (
        <>
          <RadioButtons
            data={
              listData?.map((item) => ({
                value: item.id,
                label: item.title,
              })) || []
            }
            sendDataToParent={handleChangeList}
            openedList={showedList}
          />
          {listData.map((item, i) => (
            <TodoList
              key={i}
              data={item}
              display={item.id === showedList ? "flex" : "none"}
            />
          ))}
        </>
      ) : (
        listData?.length === 0 && (
          <HeadingItem fontSize={convertPx(20)} color="gray.500">
            No todo lists found for you.
          </HeadingItem>
        )
      )}
    </>
  );
}
