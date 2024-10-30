import {
  Tooltip,
  Box,
  Button,
  Menu,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
  useBreakpointValue
} from "@chakra-ui/react";
const api=import.meta.env.VITE_API_URL
import { MenuButton } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { BiChevronDown } from "react-icons/bi";
import React from "react";
import { getChatContext } from "../../Context/ChatProvider.jsx";
import { useState } from "react";
import ProfileModal from "./ProfileModal.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading.jsx";
import UserList from "../User/UserList.jsx";
import { Badge } from "@mui/material";
import { CgMail } from "react-icons/cg";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user ,setChats, chats,setSelectedChat,notification,setNotification} = getChatContext();
  const { onClose, onOpen, isOpen } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const chevronIcon = useBreakpointValue({ sm: <BiChevronDown />});
  const accessChat= async (userId)=>{
    setLoadingChat(true)
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        }
      }
      const {data}=await axios.post(`${api}/api/chat`,{userId},config)
      if(!chats.find((chat)=>chat._id===data._id)) setChats((temp)=>[...temp,data])
      setLoadingChat(false)
      setSelectedChat(data)
      onClose()
    } catch (error) {
      toast({
        title: "Internal Server Error",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      setLoadingChat(false)
      onClose()
    }
  }
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      return 
      
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${api}/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Please search again",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      setLoading(false);
    }
  };
  const getSender=(chat)=>{
    if(user._id!=chat.users[0]._id) return chat.users[0].name
    else return chat.users[1].name
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        bg="white"
        alignItems="center"
        p="5px 10px 10px 5px"
        
        borderWidth="5px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Open sans"  >
          <i class="fa-brands fa-rocketchat fa-lg"  ></i>
          <span className="hidden sm:inline sm:ml-2 ml-0" >Chai-TalK</span>
        </Text>

        <div>
          <Menu  >
            <MenuButton p={1} marginRight={{base:'0px', sm:'15px'}}>
            <Badge max={99} badgeContent={notification.length} color="error">
              <CgMail size={'23px'} />
            </Badge>
            
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && <div>No new messages</div>}
              {notification.map((n)=>
                <MenuItem
                  key={n._id} 
                  onClick={()=>{
                    setSelectedChat(n.chat)
                    setNotification(notification.filter((nc)=>nc._id!==n._id))
                  }}
                >
                   {n.chat.isGroupChat?`New message in ${n.chat.chatName}`:`New message from ${getSender(n.chat)}`}
                </MenuItem>
              )}
            </MenuList>
          </Menu>

          <Menu >
            <MenuButton as={Button} rightIcon={chevronIcon} p={{base:'0px',sm:'2',md:'4'}} >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.profilePic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name or email"
                mr="2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              <>
                {searchResult?.map((usertemp) => {
                  return <UserList key={usertemp._id} user={usertemp} handleFunction={()=>accessChat(usertemp._id)} />;
                })}
              </>
            )}
            {loadingChat && <Spinner ml={'auto'} d='flex'/>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
