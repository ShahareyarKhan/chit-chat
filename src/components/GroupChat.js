// import React, { useContext, useEffect, useRef, useState } from 'react';
// import { UserContext } from '../context/UserContext';
// import { IoAdd, IoPersonAddSharp, IoSend, IoVideocam } from 'react-icons/io5';
// import { IoMdArrowRoundBack } from 'react-icons/io';
// import { BiSolidArrowToBottom } from 'react-icons/bi';
// import { format, isSameDay, subDays } from 'date-fns';
// import io from 'socket.io-client';
// import { MdCopyAll, MdDelete } from 'react-icons/md';

// // Create a socket instance
// const socket = io('http://localhost:5000', {
//   transports: ['websocket'],
//   secure: true
// });

// const GroupChat = () => {
//   const { groupSelect, user, setGroupSelect } = useContext(UserContext);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [typingMessage, setTypingMessage] = useState('');
//   const [scrollToBottom, setScrollToBottom] = useState(true);
//   const messagesEndRef = useRef(null);
//   const [contextMenu, setContextMenu] = useState({ visible: false, messageId: "", type: "" });
//   const contextMenuRef = useRef(null);
//   const [isTyping, setIsTyping] = useState(false);

//   useEffect(() => {
//     if (groupSelect) {
//       fetchGroupMessages();
//       socket.emit('join group', groupSelect._id);
//     }

//     socket.on('message received', (newMessage) => {
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//       if (scrollToBottom) {
//         scrollToBottomHandler();
//       }
//     });

//     socket.on('typing', ({ senderId, groupId }) => {
//       if (groupId === groupSelect._id) {
//         setTypingMessage("Someone is typing...");
//       }
//     });

//     socket.on('stop typing', ({ senderId, groupId }) => {
//       if (groupId === groupSelect._id) {
//         setTypingMessage('');
//       }
//     });

//     return () => {
//       socket.off('message received');
//       socket.off('typing');
//       socket.off('stop typing');
//     };
//   }, [groupSelect, scrollToBottom]);

//   const fetchGroupMessages = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/group/${groupSelect._id}/messages`, {
//         method: 'GET'
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setMessages(data);
//         if (scrollToBottom) {
//           scrollToBottomHandler();
//         }
//       } else {
//         console.error('Failed to fetch group messages');
//       }
//     } catch (error) {
//       console.error('Error fetching group messages', error);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (newMessage.trim()) {
//       const message = {
//         senderId: user._id,
//         name: user.name,
//         content: newMessage
//       };

//       try {
//         const response = await fetch(`http://localhost:5000/api/group/${groupSelect._id}/message`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(message)
//         });

//         if (response.ok) {
//           const data = await response.json();
//           console.log(data);
//           setMessages((prevMessages) => [...prevMessages, data]);
//           setNewMessage('');
//           socket.emit('stop typing', { senderId: user._id, groupId: groupSelect._id });
//           if (scrollToBottom) {
//             scrollToBottomHandler();
//           }
//         } else {
//           console.error('Failed to send message');
//         }
//       } catch (error) {
//         console.error('Error sending message', error);
//       }
//     }
//   };

//   const scrollToBottomHandler = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleContextMenu = (event, messageId, senderID) => {
//     event.preventDefault();
//     console.log("Message ID:", senderID);
//     console.log("User ID:", user._id);
//     setContextMenu({ visible: true, messageId, type: senderID === user._id ? "user" : "not user" });

// };

//   const handleCopyMessage = (content) => {
//     navigator.clipboard.writeText(content);
//     setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
//   };

//   const handleDeleteMessage = async (messageId) => {
//     console.log("Delete message:", messageId);

//     let alert = window.confirm("Are you sure you want to delete this message?");
//     if (!alert) return;

//     try {
//         const response = await fetch(`http://localhost:5000/api/message/delete/${messageId}`, {
//             method: 'DELETE',
//             headers: {
//                 'Authorization': `${localStorage.getItem('token')}`
//             }
//         });

//         if (response.ok) {
//             console.log('Message deleted successfully');
//             setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
//         } else {
//             console.error('Failed to delete message');
//             const errorData = await response.json();
//             console.error('Error details:', errorData);
//         }
//     } catch (error) {
//         console.error('Error during message deletion:', error);
//     } finally {
//         setContextMenu({ visible: false, messageId: null });
//     }
// };
//   const getFormattedDate = (date) => {
//     const today = new Date();
//     const yesterday = subDays(today, 1);

//     if (isSameDay(date, today)) {
//       return 'Today';
//     } else if (isSameDay(date, yesterday)) {
//       return 'Yesterday';
//     } else {
//       return format(date, 'dd/MM/yyyy');
//     }
//   };
//   const renderMessagesWithDates = () => {
//     let lastMessageDate = null;

//     return messages.map((msg, index) => {
//       const messageDate = new Date(msg.createdAt);
//       const isNewDay = !lastMessageDate || !isSameDay(lastMessageDate, messageDate);
//       lastMessageDate = messageDate;

//       return (
//         <div key={index}>
//           {isNewDay && (
//             <div className="text-center text-xs bg-[#191919] text-white p-1 rounded w-[140px] mx-auto my-2">
//               {getFormattedDate(messageDate)}
//             </div>
//           )}
//           <div className={`  relative ${msg.senderId === user._id ? 'text-right' : 'text-left'}`}
//             onContextMenu={(e) => handleContextMenu(e, msg._id, msg.senderId)} onClick={(e) => handleContextMenu(e, msg._id, msg.senderId)}>
//             <div className={`inline-block p-0.5 px-3 text-sm  max-w-[50%] break-words ${msg.senderId === user._id ? 'text-black bg-blue-400 rounded-l-md rounded-b-xl' : 'text-black bg-gray-300 rounded-r-md rounded-b-xl'}`}>
//               {msg.content}
//               <div className='flex m-0 items-center text-[10px]'>
//                 {format(messageDate, 'hh:mm a')}
//               </div>
//             </div>
//           </div>
//           <div className={`${msg.senderId === user._id ? 'text-right' : 'text-left'} text-[9px] mb-1`}>
//             {msg.name}
//           </div>
//         </div>
//       );
//     });
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
//         setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [contextMenuRef]);

//   if (!groupSelect) {
//     return <div>Loading...</div>;
//   }

//   const addPerson = async (person) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/group/${groupSelect._id}/add-member`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({
//           userId: person._id,
//         }),
//       });
  
//       if (response.ok) {
//         console.log("Person added successfully.");
        
//       } else {
//         const errorData = await response.json();
//         console.error("Error adding person:", errorData);
//       }
//     } catch (error) {
//       console.error("An error occurred while adding the person:", error);
//     }
//   };
  

//   return (
//     <div className="flex flex-col h-screen w-full bg-[#9dc4ed]">
//       <div className="w-full sticky top-0 bg-[#013c71] p-3 py-5 flex items-center z-50 text-gray-300">
//         <div className="cursor-pointer">
//           <IoMdArrowRoundBack className="text-xl md:text-2xl" onClick={() => { setGroupSelect(null) }} />
//         </div>
//         <div className="ml-4 flex items-center gap-3 w-full">
//           <div className="flex gap-5 items-center justify-between w-full">
//             <div>
//               <h2 className="font-semibold text-xl">{groupSelect.name}</h2>
//             </div>
//           </div>

//           <div className='mr-8'>
//             <IoPersonAddSharp onClick={()=>{

//             }}/>
//           </div>
//         </div>

//       </div>
//       {contextMenu.visible && (
//                 <div
//                     ref={contextMenuRef}
//                     className="bg-[#4f96d9] shadow-md w-full flex justify-end p-3 pr-8 z-50 text-xl gap-8"
//                     style={{ top: contextMenu.y, left: contextMenu.x }}
//                 >
//                     {contextMenu.type === "user" && (
//                         <>
//                             <div onClick={() => handleCopyMessage(messages.find(msg => msg._id === contextMenu.messageId)?.content)} className="cursor-pointer">
//                                 <MdCopyAll />
//                             </div>
//                             <div onClick={() => handleDeleteMessage(contextMenu.messageId)} className="cursor-pointer">
//                                 <MdDelete />
//                             </div>
//                         </>
//                     )}
//                     {contextMenu.type === "not user" && (
//                         <div onClick={() => handleCopyMessage(messages.find(msg => msg._id === contextMenu.messageId)?.content)} className="cursor-pointer">
//                             <MdCopyAll />
//                         </div>
//                     )}
//                 </div>
//             )}
//       <div className="flex-1 px-4 p-2 overflow-auto" onScroll={(e) => {
//         if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
//           setScrollToBottom(true);
//         } else {
//           setScrollToBottom(false);
//         }
//       }}>
//         {renderMessagesWithDates()}
//         <div ref={messagesEndRef} />
//         {typingMessage && (
//           <div className="fixed bg-white p-3 bottom-14 typing-wave text-xs rounded-full text-gray-200 flex gap-5 my-1">
//             <div className="typing-dot"></div>
//             <div className="typing-dot"></div>
//             <div className="typing-dot"></div>
//           </div>
//         )}
//       </div>

//       <div className=" p-1 w-full  bottom-0 bg-[#ffffff] z-50">
//         <div className="flex items-center gap-4">
//           <input
//             type="text"
//             className="flex-1 p-2 border outline-none rounded-md"
//             placeholder="Type a message..."
//             value={newMessage}
//             onChange={(e) => {
//               setNewMessage(e.target.value);
//               socket.emit('typing', { senderId: user._id, });
//               if (isTyping) {
//                 clearTimeout(isTyping);
//               }
//               setIsTyping(setTimeout(() => {
//                 socket.emit('stop typing', { senderId: user._id });
//                 setIsTyping(null);
//               }, 3000));
//             }}
//             onKeyPress={(e) => {
//               if (e.key === 'Enter') {
//                 handleSendMessage();
//               }
//             }}
//           />
//           <button
//             onClick={handleSendMessage}
//             className="  text-white p-2 "
//           >
//             <IoSend className="text-2xl text-[#075E54]" />
//           </button>
//         </div>
//       </div>
    
//     </div>
//   );
// };

// export default GroupChat;
import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { IoAdd, IoPersonAddSharp, IoSend, IoVideocam } from 'react-icons/io5';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { BiSolidArrowToBottom } from 'react-icons/bi';
import { format, isSameDay, subDays } from 'date-fns';
import io from 'socket.io-client';
import { MdCopyAll, MdDelete } from 'react-icons/md';

// Create a socket instance
const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  secure: true
});

const GroupChat = () => {
  const { groupSelect, user, setGroupSelect } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingMessage, setTypingMessage] = useState('');
  const [scrollToBottom, setScrollToBottom] = useState(true);
  const messagesEndRef = useRef(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, messageId: "", type: "" });
  const contextMenuRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // New state for adding person functionality
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (groupSelect) {
      fetchGroupMessages();
      socket.emit('join group', groupSelect._id);
    }

    socket.on('message received', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      if (scrollToBottom) {
        scrollToBottomHandler();
      }
    });

    socket.on('typing', ({ senderId, groupId }) => {
      if (groupId === groupSelect._id) {
        setTypingMessage("Someone is typing...");
      }
    });

    socket.on('stop typing', ({ senderId, groupId }) => {
      if (groupId === groupSelect._id) {
        setTypingMessage('');
      }
    });

    return () => {
      socket.off('message received');
      socket.off('typing');
      socket.off('stop typing');
    };
  }, [groupSelect, scrollToBottom]);

  const fetchGroupMessages = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/group/${groupSelect._id}/messages`, {
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        if (scrollToBottom) {
          scrollToBottomHandler();
        }
      } else {
        console.error('Failed to fetch group messages');
      }
    } catch (error) {
      console.error('Error fetching group messages', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message = {
        senderId: user._id,
        name: user.name,
        content: newMessage
      };

      try {
        const response = await fetch(`http://localhost:5000/api/group/${groupSelect._id}/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message)
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setMessages((prevMessages) => [...prevMessages, data]);
          setNewMessage('');
          socket.emit('stop typing', { senderId: user._id, groupId: groupSelect._id });
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

  const scrollToBottomHandler = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContextMenu = (event, messageId, senderID) => {
    event.preventDefault();
    console.log("Message ID:", senderID);
    console.log("User ID:", user._id);
    setContextMenu({ visible: true, messageId, type: senderID === user._id ? "user" : "not user" });

  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
  };

  const handleDeleteMessage = async (messageId) => {
    console.log("Delete message:", messageId);

    let alert = window.confirm("Are you sure you want to delete this message?");
    if (!alert) return;

    try {
      const response = await fetch(`http://localhost:5000/api/message/delete/${messageId}`, {
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
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error during message deletion:', error);
    } finally {
      setContextMenu({ visible: false, messageId: null });
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
            <div className="text-center text-xs bg-[#191919] text-white p-1 rounded w-[140px] mx-auto my-2">
              {getFormattedDate(messageDate)}
            </div>
          )}
          <div className={`  relative ${msg.senderId === user._id ? 'text-right' : 'text-left'}`}
            onContextMenu={(e) => handleContextMenu(e, msg._id, msg.senderId)} onClick={(e) => handleContextMenu(e, msg._id, msg.senderId)}>
            <div className={`inline-block p-0.5 px-3 text-sm  max-w-[50%] break-words ${msg.senderId === user._id ? 'text-black bg-blue-400 rounded-l-md rounded-b-xl' : 'text-black bg-gray-300 rounded-r-md rounded-b-xl'}`}>
              {msg.content}
              <div className='flex m-0 items-center text-[10px]'>
                {format(messageDate, 'hh:mm a')}
              </div>
            </div>
          </div>
          <div className={`${msg.senderId === user._id ? 'text-right' : 'text-left'} text-[9px] mb-1`}>
            {msg.name}
          </div>
        </div>
      );
    });
  };

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

  if (!groupSelect) {
    return <div>Loading...</div>;
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addPerson = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`http://localhost:5000/api/group/${groupSelect._id}/add-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId: selectedUser._id }),
      });

      if (response.ok) {
        console.log("Person added successfully.");
        setShowAddPersonModal(false);
        setSelectedUser(null);
      } else {
        const errorData = await response.json();
        console.error("Error adding person:", errorData);
      }
    } catch (error) {
      console.error("An error occurred while adding the person:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#9dc4ed]">
      <div className="w-full sticky top-0 bg-[#013c71] p-3 py-5 flex items-center z-50 text-gray-300">
        <div className="cursor-pointer">
          <IoMdArrowRoundBack className="text-xl md:text-2xl" onClick={() => { setGroupSelect(null) }} />
        </div>
        <div className="ml-4 flex items-center gap-3 w-full">
          <div className="flex gap-5 items-center justify-between w-full">
            <div>
              <h2 className="font-semibold text-xl">{groupSelect.name}</h2>
            </div>
          </div>

          <div className='mr-8'>
            <IoPersonAddSharp onClick={() => { 
              setShowAddPersonModal(true); 
              fetchUsers(); 
            }} />
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

      <div className="flex-1 px-4 p-2 overflow-auto" onScroll={(e) => {
        if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
          setScrollToBottom(true);
        } else {
          setScrollToBottom(false);
        }
      }}>
        {renderMessagesWithDates()}
        <div ref={messagesEndRef} />
        {typingMessage && (
          <div className="fixed bg-white p-3 bottom-14 typing-wave text-xs rounded-full text-gray-200 flex gap-5 my-1">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
      </div>

      <div className=" p-1 w-full  bottom-0 bg-[#ffffff] z-50">
        <div className="flex items-center gap-4">
          <input
            type="text"
            className="flex-1 p-2 border outline-none rounded-md"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              socket.emit('typing', { senderId: user._id, });
              if (isTyping) {
                clearTimeout(isTyping);
              }
              setIsTyping(setTimeout(() => {
                socket.emit('stop typing', { senderId: user._id });
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

      {showAddPersonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-1/2">
            <h2 className="text-lg font-semibold mb-4">Add a Person</h2>
            <div className="overflow-y-auto max-h-60">
              {users.map((person) => (
                <div 
                  key={person._id} 
                  className={`cursor-pointer p-2 ${selectedUser?._id === person._id ? 'bg-blue-200' : ''}`}
                  onClick={() => setSelectedUser(person)}
                >
                  {person.name}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => setShowAddPersonModal(false)} 
                className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button 
                onClick={addPerson} 
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
