import { Box, CloseButton, Text } from "@chakra-ui/react";
import React from "react";
const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      px={2}
      borderRadius={"lg"}
      m={1}
      mb={2}
      fontSize={"12px"}
      backgroundColor={"#de6a3d"}
      cursor={"pointer"}
      onClick={handleFunction}
    >
      <Text color={"white"}>{user.name}</Text>
      <CloseButton color={"white"} pl={3} />
    </Box>
  );
};

export default UserBadgeItem;
