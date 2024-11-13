import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoAttach, IoSend } from 'react-icons/io5';
import { BiSolidArrowToBottom } from "react-icons/bi";
import { format, isSameDay, subDays } from 'date-fns';
import io from 'socket.io-client';
import { MdCopyAll, MdDelete } from "react-icons/md";
import { LuTimer } from "react-icons/lu";
import { MdTranslate } from "react-icons/md";

// Create a socket instance
const socket = io("http://localhost:5000", {
    // transports: ['websocket', 'polling'],
    transports: ['websocket'],
    withCredentials: true,

});

socket.on('connect', () => {
    console.log('Socket connected');
});

socket.on('disconnect', () => {
    console.log('Socket disconnected');
});

const ChatSection = (props) => {
    const { friends, user, friendSelect, setFriendSelect, url, mode, setmode } = useContext(UserContext);
    const friendId = friendSelect._id;
    const [friend, setFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingMessage, setTypingMessage] = useState('');
    const [friendOnline, setFriendOnline] = useState(false);
    const messagesEndRef = useRef(null);
    const [scrollToBottom, setScrollToBottom] = useState(true);
    const [translatedMessages, setTranslatedMessages] = useState({}); // Tracks translated versions of messages

    useEffect(() => {
        if (friendId && friends.length) {
            const currFriend = friends.find(f => f._id === friendId);
            setFriend(currFriend);
        }
    }, [friendId, friends]);

    useEffect(() => {
        if (friend) {
            fetchMessages();
            socket.emit('setup', user);
            socket.emit('checkOnlineStatus', friend._id);
        }
    }, [friend, user]);

    useEffect(() => {
        socket.on('message received', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            if (scrollToBottom) {
                scrollToBottomHandler();
            }
        });

        socket.on('connection', () => {
            console.log("connected....")
        })

        socket.on('typing', (senderId) => {
            if (senderId === friend._id) {
                setTypingMessage(`${friend.name} is typing...`);
            }
        });

        socket.on('stop typing', (senderId) => {
            if (senderId === friend._id) {
                setTypingMessage('');
            }
        });

        socket.on('online status', (status) => {
            if (status.friendId === friend._id) {
                setFriendOnline(status.isOnline);
            }
        });

        return () => {
            socket.off('message received');
            socket.off('typing');
            socket.off('stop typing');
            socket.off('online status');
        };
    }, [friend, scrollToBottom,]);

    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, messageId: null, type: "" });
    const contextMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [contextMenuRef]);

    const handleContextMenu = (event, messageId, senderID) => {
        event.preventDefault();
        console.log("Message ID:", senderID);
        console.log("User ID:", user._id);
        setContextMenu({ visible: true, messageId, type: senderID === user._id ? "user" : "not user" });

    };

    const handleCopyMessage = (content) => {
        navigator.clipboard.writeText(content);
        setContextMenu({ visible: false, messageId: null });
    };

    const handleDeleteMessage = async (messageId) => {
        console.log("Delete message:", messageId);

        let alert = window.confirm("Are you sure you want to delete this message?");
        if (!alert) return;

        try {
            const response = await fetch(`${url}/api/message/delete/${messageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                console.log('Message deleted successfully');
                setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
            } else {
                console.error('Failed to delete message');
                // Optional: Extract and log the error message from the response
                const errorData = await response.json();
                console.error('Error details:', errorData);
            }
        } catch (error) {
            console.error('Error during message deletion:', error);
        } finally {
            setContextMenu({ visible: false, messageId: null });
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await fetch(`${url}/api/message/${user._id}/${friendSelect._id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
                if (scrollToBottom) {
                    scrollToBottomHandler();
                }
            } else {
                console.error('Failed to fetch messages');
            }
        } catch (error) {
            console.error('Error fetching messages', error);
        }
    };

    const scrollToBottomHandler = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const translateMessage = async (message) => {
        try {
            const response = await fetch(`https://google-translate1.p.rapidapi.com/language/translate/v2`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept-Encoding': 'application/gzip',
                    'X-RapidAPI-Key': '0bb74e0b4cmsh8c0866c686e9ba5p14b4f3jsn2c0b22718511',  // Replace with your actual RapidAPI key
                    'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
                },
                body: new URLSearchParams({
                    q: message,
                    target: "en"
                })
            });

            const data = await response.json();
            return data.data.translations[0].translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return message; // If translation fails, return original message
        }
    };

    // const handleTranslateMessage = async (message) => {
    //     // const message = messages.find(msg => msg._id === messageId);
    //     const translatedContent = await translateMessage(message);
    //     alert(`Translated Text: ${translatedContent}`);
    // };

    const handleTranslateMessage = async (messageId, content) => {
        if (translatedMessages[messageId]) {
            // Toggle to original if already translated
            setTranslatedMessages(prev => ({ ...prev, [messageId]: null }));
        } else {
            // Translate message content (use an actual translation API here)
            const translatedText = await translateMessage(content);
            setTranslatedMessages(prev => ({ ...prev, [messageId]: translatedText }));
        }
    };



    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            // const translatedMessage = await translateMessage(newMessage);
            const message = {
                senderId: user._id,
                receiverId: friend._id,
                content: newMessage
            };

            try {
                const response = await fetch(`${url}/api/message/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(message)
                });
                if (response.ok) {
                    const data = await response.json();
                    setMessages((prevMessages) => [...prevMessages, data.message]);
                    socket.emit('new message', data.message);
                    setNewMessage('');
                    socket.emit('stop typing', { senderId: user._id, receiverId: friend._id });

                    if (scrollToBottom) {
                        scrollToBottomHandler();
                    }
                }
                else {
                    console.error('Failed to send message');
                }
            } catch (error) {
                console.error('Error sending message', error);
            }
        }
    };

    const getFormattedDate = (date) => {
        const today = new Date();
        const yesterday = subDays(today, 1);

        if (isSameDay(date, today)) {
            return 'Today';
        } else if (isSameDay(date, yesterday)) {
            return 'Yesterday';
        } else {
            return format(date, 'dd/MM/yyyy');
        }
    };


    const renderMessagesWithDates = () => {
        let lastMessageDate = null;

        return messages.map((msg, index) => {
            const messageDate = new Date(msg.createdAt);
            const isNewDay = !lastMessageDate || !isSameDay(lastMessageDate, messageDate);
            lastMessageDate = messageDate;

            return (
                <div key={index} className='' >
                    {isNewDay && (
                        <div className={`text-center text-[10px] text-black p-1 rounded w-[200px] mx-auto my-2 ${mode === 'light' ? 'bg-white' : 'bg-black text-white'}`}>
                            {getFormattedDate(messageDate)}
                        </div>
                    )}

                    <div className={`mb-1 relative ${msg.senderId === user._id ? 'text-right' : 'text-left'}`}>
                        <div
                            className={`inline-block relative p-1 px-3 text-sm max-w-[50%] break-words ${msg.senderId === user._id ? `${mode === "light" ? "bg-[#8e9292]" : "bg-white text-black"} rounded-l-xl rounded-b-xl` : `${mode === "light" ? "bg-[#b3b7bb]" : "bg-gray-400 text-black"} rounded-r-xl rounded-b-xl`}`}
                            onContextMenu={(e) => handleContextMenu(e, msg._id, msg.senderId)}
                        >
                            <div className='text-left'>
                                {translatedMessages[msg._id] ? translatedMessages[msg._id] : msg.content}



                                <div className={`flex  items-center text-[10px] ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}>
                                    {format(messageDate, 'hh:mm a')}
                                </div>
                            </div>

                            <div className={`absolute w-[200px] bottom-1  text-[10px] ${msg.senderId === user._id ? "right-[110%]" : "left-[110%]"} ${mode === "light" ? "text-gray-500" : "text-gray-400"}`}>
                                {translatedMessages[msg._id] ? (
                                    <span onClick={() => handleTranslateMessage(msg._id, msg.content)} className="cursor-pointer hover:underline ">
                                        See Original
                                    </span>
                                ) : (
                                    <span onClick={() => handleTranslateMessage(msg._id, msg.content)} className=" cursor-pointer hover:underline ">
                                        See Translation
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    };

    if (!friend) {
        return <div>Loading...</div>;
    }





    return (
        <div className={`flex flex-col h-screen w-full chatsection ${mode === 'light' ? 'bg-[#c3c6c6] text-black' : 'bg-[#02020c] text-white'}`} >
            <div className={`w-full sticky top-0  p-4 flex items-center z-50 ${mode === 'light' ? 'bg-[#ffffff] text-black' : 'bg-[#000000] text-white'}`}>
                <div className="cursor-pointer" >
                    <IoMdArrowRoundBack className="text-xl md:text-2xl " onClick={() => { setFriendSelect(null) }} />
                </div>
                <div className=" ml-4 flex items-center gap-3 w-full ">
                    {friend.pic ? (
                        <img src={friend.pic} className="relative w-[40px] h-[40px] rounded-full" />
                    ) : (
                        <div className='relative text-xl w-[40px] h-[40px] rounded-full flex items-center justify-center font-bold   border '>
                            {friend.name[0]}
                        </div>
                    )}
                    {friendOnline ? (
                        <div className="absolute bottom-4 w-[12px] h-[12px] bg-green-700 rounded-full border border-white"></div>
                    ) : (
                        <div className="absolute bottom-4 w-[12px] h-[12px] bg-gray-400 rounded-full border border-white"></div>
                    )}

                    <div className='flex gap-5 items-center justify-between w-full '>
                        <div>
                            <h2 className="font-semibold text-sm">{friend.name}</h2>
                            <h2 className='text-xs'>{friend.email}</h2>
                        </div>
                    </div>
                </div>

            </div>

            {/* Onclick any message  */}
            {contextMenu.visible && (
                <div
                    ref={contextMenuRef}
                    className="bg-[#4f96d9] shadow-md w-full flex justify-end p-3 pr-8 z-50 text-xl gap-8"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    {contextMenu.type === "user" && (

                        <div onClick={() => handleDeleteMessage(contextMenu.messageId)} className="cursor-pointer">
                            <MdDelete />
                        </div>
                    )}
                    <div onClick={() => handleCopyMessage(messages.find(msg => msg._id === contextMenu.messageId)?.content)} className="cursor-pointer">
                        <MdCopyAll />
                    </div>
                </div>
            )}


            <div className='w-full  flex justify-center '>
                <div className='fixed bottom-[70px] p-1  hover:shadow-xl z-50 rounded-full cursor-pointer' onClick={() => {
                    setScrollToBottom(true);
                    scrollToBottomHandler();
                }}>
                    <BiSolidArrowToBottom className='text-xl' />
                </div>
            </div>

            <div className="flex-1 px-4 p-2 overflow-auto "
                onScroll={(e) => {
                    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
                        setScrollToBottom(true);
                    } else {
                        setScrollToBottom(false);
                    }
                }}>
                {renderMessagesWithDates()}
                <div ref={messagesEndRef} />
                {typingMessage && (
                    <div className={`fixed   p-3 bottom-14 typing-wave text-xs rounded-full flex gap-7 my-1 `}>
                        <div className={`typing-dot ${mode === "light" ? "bg-[#000000] text-white" : "bg-[#fff] text-black"}`}></div>
                        <div className={`typing-dot ${mode === "light" ? "bg-[#000000] text-white" : "bg-[#fff] text-black"}`}></div>
                        <div className={`typing-dot ${mode === "light" ? "bg-[#000000] text-white" : "bg-[#fff] text-black"}`}></div>
                    </div>
                )}
            </div>
            <div className={`p-1 w-full  bottom-0 ${mode === "light" ? "bg-[#ffffff] text-black" : "bg-[#000] text-white"} z-50`}>

                <div className="flex items-center  ">
                    <input
                        type="text"
                        className={`flex w-full p-3  outline-none rounded-md ${mode === "light" ? "bg-white" : "bg-black"} `}
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            socket.emit('typing', { senderId: user._id, receiverId: friend._id });
                            if (isTyping) {
                                clearTimeout(isTyping);
                            }
                            setIsTyping(setTimeout(() => {
                                socket.emit('stop typing', { senderId: user._id, receiverId: friend._id });
                                setIsTyping(null);
                            }, 3000));
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                    />


                    <button
                        onClick={handleSendMessage}
                        className="  text-white p-2 "
                    >
                        <IoSend className={`text-2xl ${mode === "light" ? "text-green-400" : "text-blue-400"}`} />
                    </button>

                </div>
            </div>

        </div>
    );
};

export default ChatSection;