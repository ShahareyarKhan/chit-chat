import React, { useContext, useEffect } from 'react';
import FriendList from './FriendList';
import Header from './Header';
import BottomNavbar from './BottomNavbar';
import { useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';
import ChatSection from './ChatSection';
import { TbMessageChatbot } from "react-icons/tb";
import { IoCall, IoChatbox } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  const { friendSelect, setFriendSelect } = useContext(UserContext);

  return (
    <>
      <div className='home h-[100vh] flex flex-col md:hidden'>
        {!friendSelect && <Header />}
        <div>
          {!friendSelect && <FriendList />}
          {friendSelect && <ChatSection />}
        </div>
        {!friendSelect && <BottomNavbar />}
      </div>


      <div className='hidden md:flex  '>
        <div className='bg-[#3d80a2e5] h-screen  flex flex-col gap-9 items-center justify-center '>
          <Link to="/" className='flex flex-col gap-1 justify-center items-center cursor-pointer hover:bg-[#fff] p-3 lg:p-4 aspect-square'>
            <IoChatbox />
            <div className='text-xs'>Chats</div>
          </Link>
          <Link to="/ai-chat" className='flex flex-col gap-1 justify-center items-center cursor-pointer hover:bg-[#fff] p-3 lg:p-4 aspect-square'>
            <TbMessageChatbot />
            <div className='text-xs'>AI</div>
          </Link>
          <Link to="/call" className='flex flex-col gap-1 justify-center items-center cursor-pointer hover:bg-[#fff] p-3 lg:p-4 aspect-square'>
            <IoCall />
            <div className='text-xs'>Calls</div>
          </Link>
          <Link to="/profile" className='flex flex-col gap-1 justify-center items-center cursor-pointer hover:bg-[#fff] p-3 lg:p-4 aspect-square'>
            <FaUser />
            <div className='text-xs'>User</div>
          </Link>
        </div>


        <div className='h-screen overflow-auto flex flex-col bg-[#1b507b] max-w-[40%] resize-x  '>
          <Header />
          <FriendList />
        </div>


        <div className='flex-1 bg-[#295789] w-full'>


          {!friendSelect && <div className='flex justify-center items-center h-screen text-white text-xl font-semibold'>
            Welcome to Chit-Chat App
          </div>}
          {friendSelect && <ChatSection />}
        </div>
      </div>
    </>

  );
};

export default Home;
