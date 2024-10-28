import React from "react";
import { useState } from "react";
import axios from "axios";
import UserBadgeItem from "../User/UserBadgeItem";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalHeader,
  useToast,
  FormControl,
  Input,
  ModalFooter,
  Button,
  Box,
} from "@chakra-ui/react";
import { getChatContext } from "../../Context/ChatProvider";
import UserList from "../User/UserList";
const GroupChatModal = ({ children }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [groupMembers, setGroupMembers] = useState([]);
  const [chatName, setChatName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState();

  const toast = useToast();
  const { user, chats, setChats } = getChatContext();

  const handleGroup = (userToAdd) => {
    if (!groupMembers.find((item) => item._id == userToAdd._id)) {
      setGroupMembers((groupMember) => [...groupMember, userToAdd]);
    }
  };
  
  const handleDelete=(id)=>{
    setGroupMembers((groupMember)=>groupMember.filter((item)=>item._id!=id))
  }

  const handleSearch = async (username) => {
    if (!username) {
      setSearchResults([]);
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/user?search=${username}`,
        config
      );
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Try Again!",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      //   setLoading(false)
    }
  };
  const handleSubmit = async () => {
    if(groupMembers.length<=1){
      toast({
        title: "Very few members!",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      return 
    }
    if(!chatName){
      toast({
        title: "Please enter group name!",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      return ;
    }
    try {
      const config={
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${user.token}`, 
        }
      }
      const apiData={users:groupMembers,name:chatName}
      const {data}=await axios.post('/api/chat/group',apiData,config)
      setChats((chats)=>[data,...chats])
      onClose();
      toast({
        title: `${data.chatName} created`,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-left"
      })
    } catch (error) {
      
      toast({
        title: "Internal Server Error!",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-left"
      })
      onClose();
    }
    setChatName("")
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"25px"}
            fontFamily={"Open sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create a Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setChatName(e.target.value)}
              />
              <Input
                placeholder="Add Users eg: John, Pratham, Jane"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box
                display={'flex'}
                w={'100%'}
                flexWrap={'wrap'}
            >
                {groupMembers?.map((member)=>(
                <UserBadgeItem key={member._id} user={member} handleFunction={()=>{handleDelete(member._id)}}/>  
                ))}
            </Box>
            {loading && <div>loading...</div>}
            {!loading &&
              searchResults?.slice(0, 4).map((item) => (
                <UserList
                  key={item._id}
                  user={item}
                  handleFunction={() => {
                    handleGroup(item);
                  }}
                />
              ))}
          </ModalBody>
          <ModalFooter>
            <Button
              backgroundColor="#1c571b"
              _hover={{ backgroundColor: "green" }}
              color={"white"}
              onClick={handleSubmit}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
