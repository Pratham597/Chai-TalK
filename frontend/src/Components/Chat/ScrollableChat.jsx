import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import {getChatContext} from '../../Context/ChatProvider.jsx'
import { Avatar, Tooltip } from '@chakra-ui/react'
import { useEffect } from 'react'

const ScrollableChat = ({messages}) => {
  const { user}=getChatContext();
  const isSameSender=(  messages,m,i,userId)=>{
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  }

  const isLastMessage=(messages,i,userId)=>{
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  }
  const margin=(messages, m, i, userId)=>{
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  }
    
  const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };

  
  return (
    <ScrollableFeed >
      {messages && messages.map((message,i)=>(
        <div key={message._id} style={{display:'flex'}}  >
            {
              (isSameSender(messages,message,i,user._id)||isLastMessage(messages,i,user._id)) && 
              (
              <Tooltip
                label={message.sender.name}
                placement='bottom-start'
                hasArrow
              >
                <Avatar
                  src={message.sender.profilePic}
                  mt={'7px'}
                  mr={1}
                  size={'sm'}
                  cursor={'pointer'}
                  name={message.sender.name}
                />

              </Tooltip>)
              
            }
            <span
              style={{
                backgroundColor:message.sender._id == user._id?'#BEE3F8':'#B9F5D0',
                borderRadius:'20px',
                padding:'5px 15px',
                maxWidth:'75%',
                marginLeft:margin(messages,message,i,user._id),
                marginTop:isSameUser(messages,message,i,user._id)?3:10,
                
              }}
            >
              {message.content}
              <span style={{fontSize:'10px',marginLeft:'10px'}}>{new Date(message.createdAt).toLocaleTimeString('en')}</span>
            </span>
        </div>
      ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat