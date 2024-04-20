import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/chatModels/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import Chatbox from "../components/Chatbox";

const Chatpage = () => {
  // when the user  left or add we have to fetch the chats again
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (

    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent={'space-between'} w={'100%'} h={'91.5vh'} p={'10px'} bgGradient="linear(to-t,#000000,#3AAA8C)" >

        {user && <MyChats fetchAgain={fetchAgain} />}

        {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}

      </Box >

    </div>
  );
};

export default Chatpage;