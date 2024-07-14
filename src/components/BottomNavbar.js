import React, { useState } from 'react';

import { IoCall, IoChatbox } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { GiArtificialIntelligence } from "react-icons/gi";
import { Link } from 'react-router-dom';

import { TbMessageChatbot } from "react-icons/tb";
const BottomNavbar = () => {
    return (
        <>
            <nav className='fixed  bottom-0 w-full py-3 bg-[#ffffff37] text-black flex items-center text-xl justify-around'>

                <Link to="/" className='flex flex-col gap-1 justify-center items-center cursor-pointer'>
                    <div>
                        <IoChatbox />
                    </div>
                    <div className='text-xs'>
                        Chats
                    </div>
                </Link>
                <Link to="/ai-chat" className='flex flex-col gap-1 justify-center items-center cursor-pointer'>
                    <div>
                        <TbMessageChatbot />
                    </div>
                    <div className='text-xs'>
                        AI
                    </div>
                </Link>
                <Link to="/call" className='flex flex-col gap-1 justify-center items-center cursor-pointer'>
                    <div>
                        <IoCall />
                    </div>
                    <div className='text-xs'>
                        Calls
                    </div>
                </Link>
                <Link to="/profile" className='flex flex-col gap-1 justify-center items-center cursor-pointer'>
                    <div>
                        <FaUser />
                    </div>
                    <div className='text-xs'>
                        User
                    </div>
                </Link>
            </nav>

        </>
    );
}

export default BottomNavbar;
