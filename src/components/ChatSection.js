import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoSend } from 'react-icons/io5';
import { BiSolidArrowToBottom } from "react-icons/bi";
import { format, isSameDay, subDays } from 'date-fns';
import io from 'socket.io-client';
import { MdCopyAll, MdDelete } from "react-icons/md";


// Create a socket instance
const socket = io('http://localhost:5000', {
    transports: ['polling', 'websocket'], 
    forceNew: true,
  });
  

socket.on('connect', () => {
    console.log('Socket connected');
});

socket.on('disconnect', () => {
    console.log('Socket disconnected');
});

const ChatSection = (props) => {
    const { friends, user, friendSelect, setFriendSelect, url } = useContext(UserContext);
    const friendId = friendSelect._id;
    const [friend, setFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingMessage, setTypingMessage] = useState('');
    const [friendOnline, setFriendOnline] = useState(false);
    const messagesEndRef = useRef(null);
    const [scrollToBottom, setScrollToBottom] = useState(true);

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

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
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
    const [call, setcall] = useState(false);

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
                        <div className="text-center text-xs bg-[#02162f] text-white p-2 rounded w-[200px] mx-auto  my-2">
                            {getFormattedDate(messageDate)}
                        </div>
                    )}
                    <div className={`mb-1 relative ${msg.senderId === user._id ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block relative p-1 px-3 text-sm  max-w-[50%] break-words ${msg.senderId === user._id ? ' text-black bg-[#a0bdfb] rounded-l-xl rounded-b-xl' : ' text-black msgg rounded-r-xl rounded-b-xl'} ${contextMenu.messageId === msg._id ? ' opacity-50' : ''}`} onContextMenu={(e) => handleContextMenu(e, msg._id, msg.senderId)} onClick={(e) => handleContextMenu(e, msg._id, msg.senderId)}>
                            <div className='text-left '>
                                {msg.content}
                                <div className={`flex m-0 items-center text-[10px]  ${msg.senderId === user._id ? ' justify-end' : 'justify-start'}`}>
                                    {format(messageDate, 'hh:mm a')}
                                </div>
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
        <div className="flex flex-col h-screen w-full chatsection bg-[#295789]" >
            <div className="w-full sticky top-0 bg-[#05182a] p-4 flex items-center z-50 text-white">
                <div className="cursor-pointer" >
                    <IoMdArrowRoundBack className="text-xl md:text-2xl " onClick={() => { setFriendSelect(null) }} />
                </div>
                <div className=" ml-4 flex items-center gap-3 w-full ">
                    {friend.pic ? (
                        <img src={friend.pic} className="relative w-[40px] h-[40px] rounded-full" />
                    ) : (
                        <div className='relative text-xl w-[40px] h-[40px] rounded-full flex items-center justify-center font-bold bg-white text-black border border-black'>
                            {friend.name[0]}
                        </div>
                    )}
                    {friendOnline ? (
                        <div className="absolute bottom-4 w-[12px] h-[12px] bg-green-700 rounded-full border border-white"></div>
                    ) : (
                        <div className="absolute bottom-4 w-[12px] h-[12px] bg-gray-300 rounded-full border border-white"></div>
                    )}

                    <div className='flex gap-5 items-center justify-between w-full '>
                        <div>
                            <h2 className="font-semibold text-sm">{friend.name}</h2>
                            <h2 className='text-xs'>{friend.email}</h2>
                        </div>
                    </div>
                </div>

            </div>

            {contextMenu.visible && (
                <div
                    ref={contextMenuRef}
                    className="bg-[#4f96d9] shadow-md w-full flex justify-end p-3 pr-8 z-50 text-xl gap-8"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    {contextMenu.type === "user" && (
                        <>
                            <div onClick={() => handleCopyMessage(messages.find(msg => msg._id === contextMenu.messageId)?.content)} className="cursor-pointer">
                                <MdCopyAll />
                            </div>
                            <div onClick={() => handleDeleteMessage(contextMenu.messageId)} className="cursor-pointer">
                                <MdDelete />
                            </div>
                        </>
                    )}
                    {contextMenu.type === "not user" && (
                        <div onClick={() => handleCopyMessage(messages.find(msg => msg._id === contextMenu.messageId)?.content)} className="cursor-pointer">
                            <MdCopyAll />
                        </div>
                    )}
                </div>
            )}

            <div className='w-full  flex justify-center '>
                <div className='fixed bottom-[70px] p-1 bg-[#000000] text-white hover:shadow-xl z-50 rounded-full cursor-pointer' onClick={() => {
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
                    <div className='fixed bg-white  p-3 bottom-14 typing-wave text-xs rounded-full text-gray-200 flex gap-5 my-1'>
                        <div className='typing-dot'></div>
                        <div className='typing-dot'></div>
                        <div className='typing-dot'></div>
                    </div>
                )}
            </div>
            <div className=" p-1 w-full  bottom-0 bg-[#ffffff] z-50">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        className="flex-1 p-3 border outline-none rounded-md"
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
                        <IoSend className="text-2xl text-[#075E54]" />
                    </button>
                </div>
            </div>
            
        </div>
    );
};

export default ChatSection;