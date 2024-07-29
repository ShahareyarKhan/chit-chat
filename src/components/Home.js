import React, { useContext, useEffect } from 'react'
import FriendList from './FriendList'
import Header from './Header'
import BottomNavbar from './BottomNavbar'
import { useNavigate } from 'react-router'
import { UserContext } from '../context/UserContext'
import ChatSection from './ChatSection'
// import { IoPersonAdd, IoNotifications, IoClose, IoSettings } from "react-icons/io5";
import { TbMessageChatbot } from "react-icons/tb";


import { IoCall, IoChatbox } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
    }
  })

  const { friendSelect, setFriendSelect } = useContext(UserContext);
  return (
    <div className='home'>
      <div className='h-[100vh] flex flex-col md:hidden '>
        <div className={`${friendSelect === null ? 'block' : 'hidden'} z-50`}>
          <Header friendSelect={friendSelect} setFriendSelect={setFriendSelect} />
        </div>
        <div className='z-40 '>
          <div className={`${friendSelect === null ? 'block' : 'hidden'}`}>

            <FriendList />
          </div>
          {friendSelect && <div className=' bg-red-900'>
            <ChatSection  />
          </div>}
        </div>
        <BottomNavbar />
      </div>

      <div className='hidden md:block w-full '>
        <div className='flex w-full '>
          <div className='bg-[#79cffaee] h-screen md:p-2 flex flex-col gap-9 items-center justify-center  lg:p-3  '>
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
          </div>
          <div className='bg-[#294a78] h-screen w-[45%] overflow-auto'>
            <div className=''>
              <Header />
            </div>
            <div className=''>
              <FriendList />
            </div>
          </div>
          <div className='w-full block bg-[#133557]'>
            {friendSelect !== null ?
              (<ChatSection  />)
              : <div className='flex justify-center items-center h-screen text-white text-xl font-semibold '>Welcome to Chit-Chat App</div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
