import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { getChatContext } from "../../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { BiArrowBack } from "react-icons/bi";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import "../styles.css";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import animationData from "../../animations/typingIndicator.json";
import Lottie from "react-lottie";
import { format } from "date-fns";
let socket, selectedChatCompare;

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    getChatContext();
  const [messages, setMessages] = useState([]);
  const [messageDate, setMessageDate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typingName, setTypingName] = useState("");
  const toast = useToast();
  const getSender = (chat) => {
    if (user._id != chat.users[0]._id) return chat.users[0];
    else return chat.users[1];
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, message) => {
      const date = format(new Date(message.createdAt), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setMessageDate(groupMessagesByDate(data));
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Server Error!",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      socket = io("https://chai-talk-backend.vercel.app/");
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
    } catch (error) {
      console.log("Something went wrong");
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("typing", (curruser, room) => {
      if (curruser._id !== user._id && room == selectedChatCompare._id) {
        setTypingName(curruser.name);
        setTyping(true);
      }
    });
    socket.on("stop typing", (curruser, room) => {
      if (curruser._id !== user._id && room == selectedChatCompare._id) {
        setTypingName("");
        setTyping(false);
      }
    });

    socket.on("message recieved", (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        if (!notification.includes(newMessage)) {
          setNotification([...notification, newMessage]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessage]);
        setMessageDate(groupMessagesByDate([...messages, newMessage]));
      }
    });
  });

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id, user);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const apidata = { chatId: selectedChat._id, content: newMessage };
        const { data } = await axios.post("/api/message", apidata, config);
        setNewMessage("");
        setMessages([...messages, data]);
        setMessageDate(groupMessagesByDate([...messages, data]));
        socket.emit("new message", data);
      } catch (error) {
        toast({
          title: "Unable to send message!",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top-left",
        });
        setNewMessage("");
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    socket.emit("typing", selectedChat._id, user);
    setTimeout(() => {
      socket.emit("stop typing", selectedChat._id, user);
    }, 3500);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "25px", md: "28px" }}
            w={"100%"}
            fontFamily={"100%"}
            pb={3}
            px={2}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<BiArrowBack />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                <Box display={"flex"} flexDir={"column"}>
                  <Text>{getSender(selectedChat).name}</Text>
                  <Text fontSize={"10px"} fontStyle={"italic"}>
                    {typing && `${typingName} is typing`}
                  </Text>
                </Box>
                <ProfileModal user={getSender(selectedChat)} />
              </>
            ) : (
              <>
                <Box display={"flex"} flexDirection={"column"}>
                  {selectedChat.chatName.toUpperCase()}
                  <Text fontSize={"10px"} fontStyle={"italic"}>
                    {typing && `${typingName} is typing`}
                  </Text>
                </Box>
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            h={"100%"}
            w={"100%"}
            px={3}
            backgroundColor={"#E8E8E8"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner size={"lg"} margin={"auto"} />
            ) : (
              <>
                <VStack align="stretch" spacing={3} className="messages">
                  {Object.keys(messageDate).map((date) => (
                    <Box key={date} py={4}>
                      <Text
                        fontSize="md"
                        fontWeight="bold"
                        backgroundColor={"#E0E0E0"}
                        p={1}
                        borderRadius={5}
                        color="gray.600"
                        mb={2}
                        mx={"auto"}
                        width={"-webkit-fit-content"}
                      >
                        {format(new Date(date), "MMMM d, yyyy")}
                      </Text>
                      <VStack align="stretch" spacing={2}>
                        <ScrollableChat messages={messageDate[date]} />
                      </VStack>
                      <Divider />
                    </Box>
                  ))}
                </VStack>
                {typing && (
                  <div
                    style={{
                      borderRadius: "30px",
                      height: "30px",
                      marginTop: "10px",
                    }}
                  >
                    <Lottie
                      options={defaultOptions}
                      width={70}
                      style={{ marginBottom: 15, marginLeft: 0 }}
                    />
                  </div>
                )}
                <FormControl onKeyDown={sendMessage} isRequired my={3}>
                  <Input
                    placeholder="Enter a message"
                    variant={"filled"}
                    bg={"#E0E0E0"}
                    onChange={typingHandler}
                    value={newMessage}
                  />
                </FormControl>
              </>
            )}
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Open sans"}>
            Click on user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
