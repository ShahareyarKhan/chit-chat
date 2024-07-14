import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoSend } from 'react-icons/io5';
import { BiSolidArrowToBottom } from "react-icons/bi";
import { format, isSameDay, subDays } from 'date-fns';
import io from 'socket.io-client';

// Create a socket instance
const socket = io('http://localhost:5000', {
  autoConnect: false,
  transports: ['websocket'],
});

const ChatSection = () => {
    const { friends, user } = useContext(UserContext);
    console.log(friends);
    const friendId = window.location.pathname.split("/")[2];
    const [friend, setFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
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
        }
    }, [friend]);

    // useEffect(() => {
    //     // Connect to the socket server
    //     socket.connect();
    
    //     // Join the chat room
    //     socket.emit('setup', { _id: user._id, name: user.name });
    
    //     // Notify that the user is typing
    //     const handleTyping = () => {
    //       socket.emit('typing', { senderId: user._id, receiverId: friend._id });
    //     };
    
    //     // Add event listener for typing indication
    //     socket.on('typing', () => {
    //       console.log(`${friend.name} is typing...`);
    //     });
    
    //     // Cleanup on unmount
    //     return () => {
    //       socket.disconnect();
    //       socket.off('message received');
    //       socket.off('typing');
    //     };
    //   }, [friend, user._id, user.name, scrollToBottom]);
    

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/message/${user._id}/${friend._id}`, {
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
                const response = await fetch('http://localhost:5000/api/message/send', {
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
                    socket.emit('new message', data.message); // Emit new message to the server
                    setNewMessage('');
                    if (scrollToBottom) {
                        scrollToBottomHandler();
                    }
                } else {
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
                <div key={index}>
                    {isNewDay && (
                        <div className="text-center text-sm bg-white p-1 rounded w-[50%] mx-auto text-gray-500 my-2">
                            {getFormattedDate(messageDate)}
                        </div>
                    )}
                    <div className={`mb-2 ${msg.senderId === user._id ? 'text-right ' : 'text-left'}`}>
                        <div className={`inline-block relative p-2 border border-green-600 ${msg.senderId === user._id ? 'usersend rounded-l-lg rounded-b-lg' : 'sendersend rounded-r-lg rounded-b-lg'}`}>
                            {msg.content}
                            <div className='text-xs text-gray-700 bottom-0 right-0'>
                                {format(messageDate, 'hh:mm a')}
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
        <div className="flex flex-col h-full">
        
            <div className="w-full sticky top-0 bg-white p-3 flex items-center z-50">
                <div onClick={() => window.history.back()} className="cursor-pointer">
                    <IoMdArrowRoundBack className="text-2xl" />
                </div>

                <div className="ml-4 flex items-center gap-3 ">
                    {
                        friend.pic ? (<img src={friend.pic} className="w-[40px] h-[40px] rounded-full" />) :(<div className='text-xl w-[40px] h-[40px] rounded-full flex items-center justify-center font-bold bg-gray-400 text-black border border-black'>
                            {friend.name[0]}
                        </div>)
                    }
                    
                    <div>
                        <h2 className=" font-semibold">{friend.name}</h2>
                        <h2 className='text-xs'>{friend.email}</h2>
                    </div>
                </div>
            </div>
            <div className='fixed bottom-[80px] opacity-80 right-[20px] p-2 bg-[#105c1d] text-white hover:shadow-xl z-50 rounded-full cursor-pointer' onClick={() => {
                setScrollToBottom(true);
                scrollToBottomHandler();
            }}>
                <BiSolidArrowToBottom className=' text-xl ' />
            </div>
            <div className="flex-1 p-4 overflow-auto mb-14"
                onScroll={(e) => {
                    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
                        setScrollToBottom(true);
                    } else {
                        setScrollToBottom(false);
                    }
                }}>
                {renderMessagesWithDates()}
                <div ref={messagesEndRef} />
            </div>
            <div className="fixed bottom-0 bg-white w-full flex items-center gap-2 px-1">
                <input
                    type="text"
                    className="w-full outline-none p-4 border rounded"
                    placeholder="Enter Message"
                    value={newMessage}
                    onChange={(e) => {
                        setNewMessage(e.target.value);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <IoSend
                    className="text-2xl mx-2 cursor-pointer "
                    onClick={handleSendMessage}
                />
            </div>
        </div>
    );
};

export default ChatSection;
