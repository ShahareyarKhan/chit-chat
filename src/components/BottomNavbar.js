import React, { useContext, useState } from 'react';
import { HiMiniUserGroup } from "react-icons/hi2";
import { IoChatbox } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { MdTipsAndUpdates } from "react-icons/md";
import { TbMessageChatbot } from "react-icons/tb";
const BottomNavbar = () => {
    const {group, setGroup} = useContext(UserContext);
    return (
        <>
            <nav className='fixed md:static bottom-0 w-full py-3 bg-[#3cb8dded] text-black flex items-center md:flex-col text-xl justify-around'>

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
                <div className='flex flex-col gap-1 justify-center items-center cursor-pointer' onClick={() => setGroup(!group)}>
                    <div>
                        <MdTipsAndUpdates />
                    </div>
                    <div className='text-xs'>
                        Updates
                    </div>
                </div>
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
