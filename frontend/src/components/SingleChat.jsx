import { FormControl } from "@chakra-ui/form-control";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import ProfileModal from "./chatModels/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "./chatModels/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "./config/ChatLogics";
import ChatInput from './chatModels/ChatInput';

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare; 

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [selectedChatUserPic, setSelectedChatUserPic] = useState("");
    const [notification, setNotification] = useState([]);
    const toast = useToast();

    const { selectedChat, setSelectedChat, user, setChats } = ChatState();

    // Definindo defaultOptions para evitar o erro no-undef
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const SendMessage = async (msg) => {
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                '/api/message',
                {
                    content: msg,
                    chatId: selectedChat._id,
                },
                config
            );

            socket.emit('new message', data);
            setMessages((prevMessages) => [...prevMessages, data]);
        } catch (error) {
            toast({
                title: 'Error Occurred!',
                description: 'Failed to send the Message',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        }
    };


    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id);
            
            const selectedChatUser = getSenderFull(user, selectedChat.users);
            setSelectedChatUserPic(selectedChatUser.pic);
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connect", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (
                !selectedChatCompare || // If chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageReceived.chat._id
            ) {
                // Give notification
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
            }
        });
    });

    const typingHandler = (e) => {
        if (!socketConnected) return;

        if (!istyping) {
            setIsTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && istyping) {
                socket.emit("stop typing", selectedChat._id);
                setIsTyping(false);
            }
        }, timerLength);
    };

    const blockUser = async () => {
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

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {loading ? (
                            <Text fontFamily="Helvetica">
                                Carregando...
                            </Text>
                        ) : (
                            <>
                                {messages &&
                                    (!selectedChat.isGroupChat ? (
                                        <>
                                            <Box display="flex" alignItems="center">
                                                <img
                                                    src={selectedChatUserPic}
                                                    alt={user.name}
                                                    style={{ borderRadius: "50%", marginRight: "8px", width: "40px", height: "40px" }}
                                                />
                                                <Text fontFamily="Helvetica">
                                                    {getSender(user, selectedChat.users)}
                                                </Text>
                                            </Box>
                                            <ProfileModal
                                                user={getSenderFull(user, selectedChat.users)}
                                                blockUser={blockUser}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Text fontFamily="Helvetica">
                                                {selectedChat.chatName.toUpperCase()}
                                            </Text>
                                            <UpdateGroupChatModal
                                                fetchMessages={fetchMessages}
                                                fetchAgain={fetchAgain}
                                                setFetchAgain={setFetchAgain}
                                            />
                                        </>
                                    ))}
                            </>
                        )}
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className="messages" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                overflowY: 'scroll',
                                scrollbarWidth: 'none',
                            }}>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl
                            id="first-name"
                            isRequired
                            mt={3}
                        >
                            {istyping && (
                                <div>
                                    <Lottie
                                        options={defaultOptions}
                                        width={70}
                                        style={{ marginBottom: 15, marginLeft: 0 }}
                                    />
                                </div>
                            )}
                            <ChatInput handleSendMsg={SendMessage} onChange={{typingHandler}}/> {/* Alterado para typingHandler */}
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Helvetica">
                        Clique em um usuário para começar uma conversa
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;
