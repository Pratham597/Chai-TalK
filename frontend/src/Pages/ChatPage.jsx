import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { getChatContext } from "../Context/ChatProvider.jsx";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/Chat/SideDrawer";
import MyChats from "../Components/Chat/MyChats";
import ChatBox from "../Components/Chat/ChatBox";
import { Helmet } from "react-helmet";

const ChatPage = () => {
  const { user } = getChatContext();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <>  
      <Helmet>
        <title>Chai-TalK | My Chats</title>
      </Helmet>
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px"
        >
          {user && (
            <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </div>
    </>
  );
};

export default ChatPage;
