import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
const ChatContext = createContext();
// provide the chat context to the entire app
const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState();
    const [user, setUser] = useState();
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState();
    const history = useHistory();

    // get the user info from local storage
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        // if user is not logged in, redirect to login page
        if (!userInfo) history.push("/");
    }, [history]);

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                setSelectedChat,
                user,
                setUser,
                notification,
                setNotification,
                chats,
                setChats,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;