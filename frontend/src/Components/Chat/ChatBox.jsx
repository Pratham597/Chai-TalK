import React from 'react'
import { getChatContext } from '../../Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import { useEffect,useState} from 'react'
import SingleChat from './SingleChat'
const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const{user,selectedChat,setSelectedChat}=getChatContext()
  
  return (  
    <Box
      display={{base:selectedChat?'flex':'none',md:'flex'}}
      alignItems={'center'}
      flexDir={'column'}
      w={{base:'100%',md:'68%'}}
      borderRadius={'lg'}
      p={3}
      bg={'white'}
      borderWidth={'1px'}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
    
  )
}

export default ChatBox