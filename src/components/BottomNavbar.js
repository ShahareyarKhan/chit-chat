import React, { useContext } from 'react';
import { IoChatbox } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { MdTipsAndUpdates, MdDarkMode, MdLightMode } from "react-icons/md";
import { TbMessageChatbot } from "react-icons/tb";

const BottomNavbar = () => {
    const { group, setGroup, mode, setmode } = useContext(UserContext);


    return (
        <>
            <nav
                className={`fixed md:static bottom-0 w-full py-3 ${
                    mode === 'dark' ? 'bg-[#061523] text-white' : 'bg-[#3cb8dded] text-black'
                } flex items-center md:flex-col text-xl justify-around`}
            >
                <Link to="/" className="flex flex-col gap-1 justify-center items-center cursor-pointer">
                    <IoChatbox />
                    <span className="text-xs">Chats</span>
                </Link>
                <Link to="/ai-chat" className="flex flex-col gap-1 justify-center items-center cursor-pointer">
                    <TbMessageChatbot />
                    <span className="text-xs">AI</span>
                </Link>
                <div
                    className="flex flex-col gap-1 justify-center items-center cursor-pointer"
                    onClick={() => setGroup(!group)}
                >
                    <MdTipsAndUpdates />
                    <span className="text-xs">Updates</span>
                </div>
                <Link to="/profile" className="flex flex-col gap-1 justify-center items-center cursor-pointer">
                    <FaUser />
                    <span className="text-xs">User</span>
                </Link>
            </nav>
        </>
    );
};

export default BottomNavbar;
