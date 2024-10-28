import { createContext, useContext } from "react"
import {useNavigate } from "react-router-dom";
const ChatContext = createContext()
import { useState,useEffect } from "react";

const ChatProvider=({children})=>{
    const [user, setuser] = useState();
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])
    const [notification, setNotification] = useState([])
    let navigate=useNavigate()
    useEffect(() => {
        const curruser=JSON.parse(localStorage.getItem("user"))
        setuser(curruser)
        if(!curruser) navigate('/')
    }, [navigate])
    

    return (
        <ChatContext.Provider  value={{user,setuser,chats, setChats,selectedChat,setSelectedChat,notification,setNotification}}>
            {children}  
        </ChatContext.Provider>
    )
}

const getChatContext=()=>{
    return useContext(ChatContext)
}
export {getChatContext}
export default ChatProvider;