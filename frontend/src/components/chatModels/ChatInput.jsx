import React, { useState } from 'react';
import Picker from 'emoji-picker-react';
import { IoMdSend } from 'react-icons/io';
import { BsBrightnessHighFill } from 'react-icons/bs';

function ChatInput({ handleSendMsg }) {
    const [showEmoji, setShowEmoji] = useState(false);
    const [msg, setMsg] = useState('');

    const handleEmojiPicker = () => {
        setShowEmoji(!showEmoji);
    };

    const handleEmojiClick = (emoji) => {
        setMsg(msg + emoji.emoji);
    };

    const sendChat = (event) => {
        event.preventDefault();
        if (msg.trim() !== '') {
            handleSendMsg(msg);
            setMsg('');
        }
    };

    return (
        <div style={{ display: "grid", gridTemplateColumns: '5% 95%', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '0 2rem', paddingBottom: '0.3rem' }}>
            <div>
                <div>
                    <BsBrightnessHighFill onClick={handleEmojiPicker} />
                    {
                        showEmoji && <Picker height={'350px'} theme='dark' onEmojiClick={handleEmojiClick} />
                    }
                </div>
            </div>
            <form onSubmit={sendChat} style={{ display: 'flex' }}>
                <input 
                    value={msg} 
                    onChange={(e) => setMsg(e.target.value)} 
                    style={{ width: '90%', height: '60%', padding: '0.5rem', backgroundColor: 'transparent', color: 'black', border: 'none', paddingLeft: '1rem', outline: 'none', fontSize: '1.0rem' }} 
                    type="text" 
                    placeholder='Escreva sua mensagem aqui...' 
                />
                <button 
                    type='submit' 
                    style={{ 
                        marginLeft: 'auto', 
                        display: "inline-flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        marginRight: 0 
                    }}
                >
                    <IoMdSend/>
                </button>
            </form>

        </div>
    );
}

export default ChatInput;
