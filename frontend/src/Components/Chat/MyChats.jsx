import React from "react";
import { useState, useEffect } from "react";
import { getChatContext } from "../../Context/ChatProvider";
import { Box, Button, useToast, Stack,Text } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({fetchAgain}) => {
  const { selectedChat, setSelectedChat, user, chats, setChats } =getChatContext();
  const toast = useToast();

  const getSender=(chat)=>{
    if(user._id!=chat.users[0]._id) return chat.users[0].name
    else return chat.users[1].name
  }

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        "/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "Internal Server Error",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      h={"100%"}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"Open sans"}
        w={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Text fontFamily={'Open sans'} fontSize={{base:'20px',sm:'30px'}} >My Chats</Text>
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<i class="fa-solid fa-plus"></i>}
          >
            New group chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        p={"3"}
        bg={"#F8F8F8"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={3}
                borderRadius={"lg"}
                border={3}
                key={chat._id}
              >
                <Text fontFamily={'Open sans'}>{!chat.isGroupChat ? getSender(chat) : chat.chatName}</Text>
                <Text fontSize={'sm'} fontWeight={'200'} fontFamily={'Open sans'}>{`${chat.latestMessage?.sender.name}: ${chat.latestMessage?.content}`}</Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
