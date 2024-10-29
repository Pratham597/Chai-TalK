import { useDisclosure, Box,Modal, Button, IconButton, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalCloseButton, useToast, FormControl, Input, ModalFooter, Spinner } from "@chakra-ui/react";
import React from "react";
import {getChatContext} from '../../Context/ChatProvider.jsx'
import { useState } from "react";
import axios from "axios";
import UserBadgeItem from "../User/UserBadgeItem.jsx";
import UserList from "../User/UserList.jsx";
const api=import.meta.env.VITE_API_URL
const UpdateGroupChatModal = ({ fetchAgain ,setFetchAgain, fetchMessages}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {selectedChat,setSelectedChat,user}=getChatContext()
  const [groupName, setGroupName] = useState("")
  const [search,setSearch]=useState("")
  const [searchResults,setSearchResults]=useState([])
  const [loading,setLoading]=useState(false)
  const [renameLoading, setRenameLoading] = useState(false)
  const toast=useToast()


  // Handle Methods.
  const handleRemove= async(existuser)=>{
    if(!selectedChat.users.find((existusers)=>existusers._id===existuser._id)){
      toast({
        title: "User Not Exists!",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      return 
    }
    if(selectedChat.groupAdmin._id!==user._id){
      toast({
        title: "Only admins are allowed!",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      return 
    }
    try {
      setLoading(true)
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      const apiData={chatId:selectedChat._id,userId:existuser._id}
      const {data}=await axios.put(`${api}/api/chat/groupremove`,apiData,config)
      existuser._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain)
      setLoading(false)
      fetchMessages()
      
    } catch (error) {
      toast({
        title: "Please try again!",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false)
    }

  }
  const handleRename= async ()=>{
    if(!groupName) {
      toast({
        title: "Please give valid name",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setRenameLoading(true)
      const config={
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${user.token}`
        }
      }
      const apiData={chatId:selectedChat._id,chatName:groupName}
      const {data}=await axios.put(`${api}/api/chat/rename`,apiData,config)
      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameLoading(false)
    } catch (error) {
      toast({
        title: "Unable to update",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      setRenameLoading(false)
    }

    setGroupName("")
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
        `${api}/api/user?search=${username}`,
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
        setLoading(false)
    }
  };
  
  const handleAddUser=async(newUser)=>{
    if(selectedChat.users.find((existuser)=>existuser._id==newUser._id)){
      toast({
        title: "User Already Exists!",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      return 
    }
    if(selectedChat.groupAdmin._id!==user._id){
      toast({
        title: "Only admins are allowed!",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      return 
    }
    try {
      setLoading(true)
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      const apiData={chatId:selectedChat._id,userId:newUser._id}
      const {data}=await axios.put(`${api}/api/chat/groupadd`,apiData,config)
      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
    } catch (error) {
      toast({
        title: "Please try again!",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false)
    }
    
  }

  // Function to return.
  return (
    <>
     <IconButton
        display={{base:'flex'}}
        icon={ <i class="fa-solid fa-eye"></i>}
        onClick={onOpen}/>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader
            fontSize={'35px'}
            fontFamily={'Open sans'}
            display={'flex'}
            justifyContent={'center'}
            >
                {selectedChat.chatName}
            </ModalHeader>
            <ModalCloseButton  />
            <ModalBody>
            <Box
                display={'flex'}
                w={'100%'}
                flexWrap={'wrap'}
            >
                {selectedChat.users.map((member)=>(
                <UserBadgeItem key={member._id} user={member} handleFunction={()=>{handleRemove(member)}}/>  
                ))}
            </Box>
            <FormControl display={'flex'} >
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  value={groupName}
                  onChange={(e)=>setGroupName(e.target.value)}
                />
                <Button
                  variant={'solid'}
                  colorScheme="teal"
                  ml={1}
                  isLoading={renameLoading}
                  onClick={handleRename}
                >
                  Update
                </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add user to group"
                mb={1}
                onChange={(e)=>handleSearch(e.target.value)}
              />
            </FormControl>
            {loading? <Spinner size={'lg'}  my={2} />:(
              searchResults?.slice(0, 4).map((item) => (
                <UserList
                  key={item._id}
                  user={item}
                  handleFunction={() => {
                    handleAddUser(item);
                  }}
                />
              ))
            )}
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={()=>handleRemove(user)}
                colorScheme="red"
              >
                Leave Group
              </Button>
            </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
