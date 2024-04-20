import { AddIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "./config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./chatModels/GroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

export const blockUser = async (setSelectedChat, selectedChat, setChats, toast) => {
  try {
    // Atualize a lista de chats removendo o chat selecionado
    setChats((prevChats) => prevChats.filter((chat) => chat._id !== selectedChat._id));
    // Limpe o chat selecionado
    setSelectedChat(null);
    toast({
      title: "Usuário bloqueado",
      description: "O chat foi removido da lista",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  } catch (error) {
    toast({
      title: "Erro ao bloquear o usuário",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();

    const socket = io(ENDPOINT);
    
    socket.on("useronline", (data) => {
      setOnlineUsers(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Helvetica"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        Meus Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            Novo Grupo
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
                {/* Renderizar a bolinha verde se o usuário estiver online */}
                {onlineUsers.some((onlineUser) => onlineUser._id === chat._id) && (
                  <CheckCircleIcon color="green.400" />
                )}
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
