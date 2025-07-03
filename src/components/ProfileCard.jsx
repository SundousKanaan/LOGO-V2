import {
  Flex,
  Text,
  VStack,
  HStack,
  Spacer,
  Avatar,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import { convertPx } from "../hooks/useConvertPx";
import { UsePickRandomColor } from "../hooks/usePickRandomColor";
import ButtonItem from "./mini-components/ButtonItem";

function ProfileCard({ user, isloading, onEdit, onDelete }) {
  return (
    <Flex
      bg={"white"}
      borderRadius={convertPx(7)}
      padding={`${convertPx(24)} ${convertPx(16)}`}
      mb={convertPx(24)}
      flexDirection={{ base: "column", md: "row" }}
      alignItems="center"
      gap={convertPx(14)}
    >
      <SkeletonCircle loading={isloading}>
        <Avatar.Root
          boxShadow={`0 0 0 ${convertPx(3)} var(--chakra-colors-gray-100)`}
          size={"2xl"}
          colorPalette={UsePickRandomColor(user?.first_name)}
        >
          <Avatar.Fallback />
          <Avatar.Image
            src={user?.photo}
            alt={`${user?.first_name} ${user?.last_name} profile photo`}
          />
        </Avatar.Root>
      </SkeletonCircle>

      <VStack gap={1} alignItems={{ base: "center", lg: "start" }}>
        <Skeleton loading={isloading} w={convertPx(150)} h={convertPx(20)}>
          <Text
            fontSize={convertPx(16)}
            fontWeight={600}
            color="secondaryColor"
            textTransform="capitalize"
          >
            {user?.first_name} {user?.last_name}
          </Text>
        </Skeleton>

        <Skeleton loading={isloading} w={convertPx(200)} h={convertPx(20)}>
          <Text fontSize={convertPx(14)} fontWeight={400} color="gray.500">
            {user?.email}
          </Text>
        </Skeleton>

        <Skeleton loading={isloading} w={convertPx(70)} h={convertPx(20)}>
          <Text
            fontSize={convertPx(14)}
            fontWeight={400}
            color="gray.500"
            textTransform={"capitalize"}
          >
            {user?.user_type}
          </Text>
        </Skeleton>
      </VStack>

      <Spacer display={{ base: "none", md: "block" }} />
      <HStack>
        {!isloading && (
          <>
            <ButtonItem
              bg="themeColor"
              color="white"
              w={convertPx(100)}
              onClick={onEdit}
            >
              Edit
            </ButtonItem>
            <ButtonItem
              bg="redColor"
              color="white"
              w={convertPx(100)}
              onClick={onDelete}
            >
              Delete
            </ButtonItem>
          </>
        )}
      </HStack>
    </Flex>
  );
}

export default ProfileCard;
