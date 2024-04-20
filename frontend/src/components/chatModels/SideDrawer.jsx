import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text, } from "@chakra-ui/layout";
import {
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
} from "@chakra-ui/menu";
import {
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../config/ChatLogics";
import UserListItem from "../ProfileStruct/UserListItem";
import { ChatState } from "../../Context/ChatProvider";

function SideDrawer() {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const {
        setSelectedChat,
        user,
        notification,
        setNotification,
        chats,
        setChats,
    } = ChatState();

    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const history = useHistory();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        try {
            setLoading(true);

            // sending bearer token with the request
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const accessChat = async (userId) => {
        console.log(userId);

        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
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
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
                fontFamily="Helvetica"

            >
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fas fa-search"></i>
                        <Text display={{ base: "none", md: "flex" }} px={4}>
                            Pesquisar Usuário
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize="2xl" fontFamily="Helvetica" fontWeight={'bold'}>
                    CHAT-UX
                </Text>

                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>

                        <MenuList pl={2}>
                            {!notification.length && "Sem Novas Mensagens"}
                            {notification.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotification(notification.filter((n) => n !== notif));
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `Novas Mensagens em ${notif.chat.chatName}`
                                        : `Novas Mensagens de ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>

                    <Menu>
                        <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
                            <Avatar
                                size="sm"
                                cursor="pointer"
                                name={user.name}
                                src={user.pic}
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>Meu perfil</MenuItem>{" "}
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Sair</MenuItem>
                        </MenuList>
                    </Menu>
                </div>


                <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerHeader fontWeight={'bold'} borderBottomWidth="1px">PESQUISAR USUÁRIOS</DrawerHeader>
                        <DrawerBody bgGradient="linear(to-t,#000000,#3AAA8C)">
                            <Box display="flex" pb={2}>
                                <Input
                                    textColor={'white'}
                                    borderColor={'white'}
                                    placeholder="Email ou nome"
                                    mr={2}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    _placeholder={{ color: "black" }}
                                />
                                <Button onClick={handleSearch}>PROCURAR</Button>
                            </Box>
                            {loading ? (
                                <ChatLoading />
                            ) : (
                                searchResult?.map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => accessChat(user._id)}
                                    />
                                ))
                            )}
                            {loadingChat && <Spinner ml="auto" d="flex" />}
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </Box>
        </>
    );
}

export default SideDrawer;