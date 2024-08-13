import React, { useContext, useEffect } from 'react';
import FriendList from './FriendList';
import Header from './Header';
import BottomNavbar from './BottomNavbar';
import { useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';
import ChatSection from './ChatSection';
import { TbMessageChatbot } from "react-icons/tb";
import { IoChatbox } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { IoIosChatbubbles } from "react-icons/io";
import { HiMiniUserGroup } from "react-icons/hi2";
import GroupChat from './GroupChat';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  const { friendSelect, setFriendSelect, group, setGroup, groupSelect } = useContext(UserContext);

  return (
    <>
      <div className='home min-h-[100vh] flex flex-col md:hidden'>
        {!friendSelect && !groupSelect && <Header />}
        <div>
          {!friendSelect && !groupSelect && <FriendList />}
          {friendSelect && <ChatSection />}
          {groupSelect && <GroupChat />}
        </div>
        {!friendSelect && !groupSelect && <BottomNavbar />}
      </div>


      <div className='hidden md:flex  '>
        <div className='bg-[#3d80a2e5] h-screen  flex flex-col gap-9 items-center justify-center w-[10%] max-w-[50px]'>
          <Link to="/" className='flex flex-col gap-1 justify-center items-center cursor-pointer hover:bg-[#fff] p-3 lg:p-4 aspect-square'>
            <IoChatbox />
            <div className='text-xs'>Chats</div>
          </Link>
          <Link to="/ai-chat" className='flex flex-col gap-1 justify-center items-center cursor-pointer hover:bg-[#fff] p-3 lg:p-4 aspect-square'>
            <TbMessageChatbot />
            <div className='text-xs'>AI</div>
          </Link>
          <div className='flex flex-col gap-1 justify-center items-center cursor-pointer hover:bg-[#fff] p-3 lg:p-4 aspect-square' onClick={() => setGroup(!group)}>
            <HiMiniUserGroup />
            <div className='text-xs'>Group</div>
          </div>
          <Link to="/profile" className='flex flex-col gap-1 justify-center items-center cursor-pointer hover:bg-[#fff] p-3 lg:p-4 aspect-square'>
            <FaUser />
            <div className='text-xs'>User</div>
          </Link>
        </div>

        <div className='h-screen overflow-auto flex flex-col bg-[#1b507b] w-[35%] min-w-[270px] max-w-[400px] resize-x  '>
          <Header />
          <FriendList />
        </div>

        <div className='flex-1 bg-[#3d6da1] min-w-[57%]'>
          {!friendSelect && !groupSelect && <div className='flex flex-col justify-center items-center h-screen text-white text-xl font-semibold'>
            <div className='p-2 bg-white rounded-xl'>                        <IoIosChatbubbles className='text-4xl lg:text-5xl text-[#093d70]' />
            </div>
            <div className='text-center font-serif font-normal mt-4 text-black'>
              Welcome to Chit-Chat App
            </div>
            <p className='font-normal text-sm text-gray-400 mt-3'>
              Select a chat to start messaging
            </p>
          </div>}
          {friendSelect && <ChatSection />}
          {groupSelect && <GroupChat />}
        </div>
      </div>
    </>

  );
};

export default Home;
