import React, { useState } from 'react'
import Picker from 'emoji-picker-react'
import { IoMdSend } from 'react-icons/io'
import { BsEmojiSmileFill } from 'react-icons/bs'

function ChatInput({ handleSendMsg }) {

    const [showEmoji, setShowEmoji] = useState(false)
    const [msg, setMsg] = useState('')

    const handleEmojiPicker = () => {
        setShowEmoji(!showEmoji);
    }
    const handleEmojiClick = (emoji) => {
        // console.log(emoji)
        let message = msg;
        message += emoji.emoji;
        setMsg(message);
    }
    const sendChat = (event) => {
        event.preventDefault();
        if (msg.length > 0) {
            handleSendMsg(msg)
            setMsg('')
        }
    }
    return (
        <div className='Container1' style={{ display: "grid", gridTemplateColumns: '5% 95%', alignItems: 'center', backgroundColor: '#080432', padding: '0 2rem', paddingBottom: '0.3rem' }}>
            <div className="flex items-center text-white gap-4 ">
                <div className="relative">
                    <BsEmojiSmileFill onClick={handleEmojiPicker} className='text-2xl cursor-pointer text-yellow-300 ' />
                    {
                        showEmoji && <Picker height={'350px'} theme='dark' onEmojiClick={handleEmojiClick} />
                    }
                </div>
            </div>
            <form onSubmit={(e) => { sendChat(e) }} className='w-full rounded-3xl flex justify-center gap-8 bg-slate-400/30'>
                <input value={msg} onChange={(e) => {
                    setMsg(e.target.value)
                }} style={{ width: '90%', height: '60%',padding:'0.5rem', backgroundColor: 'transparent', color: 'white', border: 'none', paddingLeft: '1rem',outline:'none' ,fontSize: '1.2rem' }} type="text" placeholder='type your message here...' />
                <button type='submit' className="py-1 px-8 rounded-3xl flex justify-center items-center bg-violet-400 border-none">
                    <IoMdSend className='text-xl text-white cursor-pointer' />
                </button>
            </form>
        </div>
    )
}

export default ChatInput