import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { IoMdArrowRoundBack } from "react-icons/io";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MdDelete } from "react-icons/md";
const genAI = new GoogleGenerativeAI("AIzaSyAPMXpo85GlPN-gAcmqkidHH74iZFBN5v4");

const ChatAI = () => {
    const [prompt, setPrompt] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [chatOption, setChatOption] = useState({ visible: false, index: null });

    const generate = async () => {
        if (prompt.trim()) {
            setIsTyping(true);
            setChatHistory(prev => [...prev, { sender: 'user', content: prompt }]);
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = await model.generateContent(prompt);
                const content = await result.response.text(); // Adjusted based on expected response structure
                setChatHistory(prev => [...prev, { sender: 'ai', content: content }]);
            } catch (error) {
                console.error("Error generating content:", error);
                if (error.response) {
                    console.error("API Response:", error.response.data);
                }
                setChatHistory(prev => [...prev, { sender: 'ai', content: "Sorry, there was an error processing your request." }]);
            }
            setIsTyping(false);
            setPrompt("");
        }
    };
    
    const handleTyping = () => {
        if (!typing) {
            setTyping(true);
        }
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            setTyping(false);
        }, 1000);
    };
    
    let typingTimeout;
    
    const handleDeleteMessage = (index) => {
        setChatHistory(prev => prev.filter((_, i) => i !== index));
        setChatOption({ visible: false, index: null });
    };
    
    const handleDoubleClick = (index) => {
        setChatOption(prev => ({ visible: !prev.visible, index }));
    };
    
    return (
        <div className="flex flex-col h-full">
            <div className="w-full sticky top-0 bg-white z-50 p-5 flex items-center">
                <div onClick={() => window.history.back()} className="cursor-pointer">
                    <IoMdArrowRoundBack className="text-2xl" />
                </div>
    
                <div className="ml-4 flex items-center gap-3 ">
                    <div className='text-2xl w-[50px] h-[50px] rounded-full flex items-center justify-center font-bold bg-gray-400 text-black border border-black'>
                        AI
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Chat with AI</h2>
                    </div>
                </div>
            </div>
    
            <div className="flex-1 p-4 overflow-auto mb-14">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`mb-2 relative w-full ${msg.sender === 'user' ? 'text-right' : 'text-left'}`} onClick={() => handleDoubleClick(index)}>
                        <div className={`inline-block p-2 max-w-[49%] rounded ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                            {msg.content.split('\n').map((line, i) => (
                                <div key={i}>{line.replace('#', '').replace('*', '')}</div>
                            ))}
                        </div>
    
                        {chatOption.visible && chatOption.index === index && (
                            <div className={`absolute ${msg.sender === "user" ? "left-0" : "right-0"} top-0 flex justify-center items-center h-full px-2 text-sm`}>
                                <div onClick={() => handleDeleteMessage(chatOption.index)}><MdDelete className="text-white text-2xl" /></div>
                            </div>
                        )}
                    </div>
                ))}
                {isTyping && <div className="text-left">AI is typing...</div>}
            </div>
            <div className="fixed bottom-0 bg-white w-full flex items-center gap-2 px-1">
                <input
                    type="text"
                    className="w-full outline-none p-4 border rounded"
                    placeholder="Enter your prompt"
                    value={prompt}
                    onChange={(e) => {
                        setPrompt(e.target.value);
                        handleTyping();
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && generate()}
                />
                <IoSend
                    className="text-2xl mx-2 cursor-pointer"
                    onClick={generate}
                />
            </div>
        </div>
    );

};    


export default ChatAI;
