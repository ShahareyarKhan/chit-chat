import React, { useState, useEffect, useContext } from 'react';
import { IoSend } from 'react-icons/io5';
import { IoMdArrowRoundBack } from "react-icons/io";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MdDelete } from "react-icons/md";
import { UserContext } from '../context/UserContext'; // Assuming mode is in context

const genAI = new GoogleGenerativeAI("AIzaSyAPMXpo85GlPN-gAcmqkidHH74iZFBN5v4");

const ChatAI = () => {
    const { mode, setMode } = useContext(UserContext); // Access mode from context
    const [prompt, setPrompt] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [chatOption, setChatOption] = useState({ visible: false, index: null });

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const generate = async () => {
        if (prompt.trim()) {
            setIsTyping(true);
            setChatHistory(prev => [...prev, { sender: 'user', content: prompt }]);
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = await model.generateContent(prompt);
                const content = await result.response.text(); 
                setChatHistory(prev => [...prev, { sender: 'ai', content: content }]);
            } catch (error) {
                console.error("Error generating content:", error);
                setChatHistory(prev => [...prev, { sender: 'ai', content: "Sorry, there was an error processing your request." }]);
            }
            setIsTyping(false);
            setPrompt("");
        }
    };

    const handleDeleteMessage = (index) => {
        setChatHistory(prev => prev.filter((_, i) => i !== index));
        setChatOption({ visible: false, index: null });
    };

    const scrollToBottom = () => {
        const chatContainer = document.querySelector(".chat-container");
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    };

    return (
        <div className={`flex flex-col min-h-screen ${mode === 'dark' ? 'bg-[#06121f]' : 'bg-[#41b3b1]'} chat-container`}>
            <div className={`w-full sticky top-0 ${mode === 'dark' ? 'bg-[#000e1bd2] text-white' : 'bg-gray-100 text-black'} z-50 p-4 flex items-center`}>
                <div onClick={() => window.history.back()} className="cursor-pointer">
                    <IoMdArrowRoundBack className="text-xl" />
                </div>

                <div className="ml-4 flex items-center gap-3 ">
                    <div className={`text-xl w-[40px] h-[40px] rounded-full flex items-center justify-center font-bold ${mode === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} border border-black`}>
                        AI
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Chat with AI</h2>
                    </div>
                </div>

                {isTyping && <div className="loading flex gap-2 absolute right-5">
                    <div className='w-[10px] h-[10px] rounded-full bg-white'></div>
                    <div className='w-[10px] h-[10px] rounded-full bg-white'></div>
                    <div className='w-[10px] h-[10px] rounded-full bg-white'></div>
                </div>}
            </div>

            <div className="flex-1 p-4 overflow-auto mb-14">
                <div className={`text-xs text-center p-1 ${mode === 'dark' ? 'bg-[#234] text-white' : 'bg-gray-200 text-black'} rounded max-w-[400px] mx-auto mb-2`}>
                    The AI chat interactions are not stored in the database.
                </div>

                {chatHistory.map((msg, index) => (
                    <div key={index} className={`mb-2 relative w-full ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-2 max-w-[49%] ${msg.sender === 'user' ? (mode === 'dark' ? 'bg-gray-800' : 'bg-gray-300') : (mode === 'dark' ? 'bg-[#223344]' : 'bg-gray-200')} rounded-xl text-${mode === 'dark' ? 'white' : 'black'}`}>
                            {msg.content.split('\n').map((line, i) => (
                                <div key={i}>{line.replace('#', '').replace('*', '')}</div>
                            ))}
                        </div>

                        {chatOption.visible && chatOption.index === index && (
                            <div className={`absolute ${msg.sender === "user" ? "left-0" : "right-0"} top-0 flex justify-center items-center h-full px-2 text-sm`}>
                                <div onClick={() => handleDeleteMessage(chatOption.index)}>
                                    <MdDelete className="text-red-500 text-2xl" />
                                </div>
                            </div>
                        )}
                    </div>
                ))}

            </div>
            <div className={`fixed bottom-0 ${mode === 'dark' ? 'bg-[#234]' : 'bg-gray-200'} w-full flex items-center gap-2 px-1`}>
                <input
                    type="text"
                    className={`w-full outline-none ${mode === 'dark' ? 'bg-[#234] text-white' : 'bg-white text-black'} p-3 border rounded`}
                    placeholder="Enter your prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && generate()}
                />
                <IoSend
                    className="text-2xl mx-2 text-blue-500 cursor-pointer"
                    onClick={generate}
                />
            </div>
        </div>
    );
};

export default ChatAI;
