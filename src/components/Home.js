// import React, { useContext, useEffect, useState } from 'react';
// import FriendList from './FriendList';
// import Header from './Header';
// import BottomNavbar from './BottomNavbar';
// import { useNavigate } from 'react-router';
// import { UserContext } from '../context/UserContext';
// import ChatSection from './ChatSection';
// import { TbMessageChatbot } from "react-icons/tb";
// import { IoChatbox } from 'react-icons/io5';
// import { FaUser } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import { IoIosChatbubbles } from "react-icons/io";
// import { MdTipsAndUpdates } from "react-icons/md";
// import GroupChat from './GroupChat';

// const Home = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!localStorage.getItem('token')) {
//       navigate('/login');
//     }
//   }, [navigate]);
//   const[loading, setloading]=useState(false);

//   useEffect(() => {
//     setloading(true); // Set loading to true before fetching data
//     setTimeout(() => {
//       fetchUserDetails();
//       setloading(false); // Set loading to false after fetching data
//     }, 1000);
//   }, []);
  
  
//   const { friendSelect, fetchUserDetails,  group, setGroup, groupSelect } = useContext(UserContext);

//   return (
//     <>
//       <div className='home min-h-[100vh] flex flex-col md:hidden'>
//       {loading&&<div className="flex items-center justify-center h-screen gap-3 loading">
//            <div className="text-xl font-semibold w-[10px] h-[10px] bg-[#ffffff] rounded-full"></div>
//            <div className="text-xl font-semibold w-[10px] h-[10px] bg-[#ffffff] rounded-full"></div>
//            <div className="text-xl font-semibold w-[10px] h-[10px] bg-[#ffffff] rounded-full"></div>
//          </div>}
//         {!friendSelect && !groupSelect && <Header />}
//         <div>
//           {!friendSelect && !groupSelect && <FriendList />}
//           {friendSelect && <ChatSection />}
//           {groupSelect && <GroupChat />}
//         </div>
//         {!friendSelect && !groupSelect && <BottomNavbar />}
//       </div>


//       <div className='hidden md:flex  '>
//         <div className=' h-screen  flex flex-col gap-9 items-center justify-center w-[10%] max-w-[50px]'>
//           <Link to="/" className='flex flex-col gap-1 justify-center items-center cursor-pointer hover:bg-[#fff] p-3 lg:p-4 aspect-square'>
//             <IoChatbox />
//             <div className='text-[9px]'>Chats</div>
//           </Link>
//           <Link to="/ai-chat" className='flex flex-col gap-1 justify-center items-center cursor-pointer hover:bg-[#fff] p-3 lg:p-4 aspect-square'>
//             <TbMessageChatbot />
//             <div className='text-[9px]'>AI</div>
//           </Link>
//           <div className='flex flex-col gap-1 justify-center items-center cursor-pointer hover:bg-[#fff] p-3 lg:p-4 aspect-square' onClick={() => setGroup(!group)}>
//           <MdTipsAndUpdates />
//             <div className='text-[9px]'>Updates</div>
//           </div>
//           <Link to="/profile" className='flex flex-col gap-1 justify-center items-center cursor-pointer hover:bg-[#fff] p-3 lg:p-4 aspect-square'>
//             <FaUser />
//             <div className='text-[9px]'>User</div>
//           </Link>
//         </div>

//         <div className='h-screen overflow-auto flex flex-col bg-[#1b507b] w-[35%] min-w-[270px] max-w-[400px] resize-x  '>
//           <Header />
//           <FriendList />
//         </div>

//         <div className='flex-1 bg-[#3d6da1] min-w-[57%]'>
//           {!friendSelect && !groupSelect && <div className='flex flex-col justify-center items-center h-screen text-white text-xl font-semibold'>
//             <div className='p-2 bg-white rounded-xl'>                        <IoIosChatbubbles className='text-4xl lg:text-5xl text-[#093d70]' />
//             </div>
//             <div className='text-center font-serif font-normal mt-4 text-black'>
//               Welcome to Chit-Chat App
//             </div>
//             <p className='font-normal text-sm text-gray-400 mt-3'>
//               Select a chat to start messaging
//             </p>
//           </div>}
//           {friendSelect && <ChatSection />}
//           {groupSelect && <GroupChat />}
//         </div>
//       </div>
//     </>

//   );
// };

// export default Home;

import React, { useContext, useEffect, useState } from 'react';
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
import { MdTipsAndUpdates } from "react-icons/md";
import GroupChat from './GroupChat';

const Home = () => {
  const navigate = useNavigate();
  const { friendSelect, fetchUserDetails, group, setGroup, groupSelect, mode } = useContext(UserContext);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    setloading(true); // Set loading to true before fetching data
    setTimeout(() => {
      fetchUserDetails();
      setloading(false); // Set loading to false after fetching data
    }, 1000);
  }, []);

  return (
    <>
      <div className={`home min-h-[100vh] flex flex-col md:hidden ${mode === 'light' ? 'bg-[#46f2ff] text-black' : 'bg-[#090829] text-white'}`}>
        {loading && <div className="flex items-center justify-center h-screen gap-3 loading">
          <div className={`text-xl font-semibold w-[10px] h-[10px] ${mode==='light' ? 'bg-[#000000]' : 'bg-[#ffffff]'} rounded-full`}></div>
          <div className={`text-xl font-semibold w-[10px] h-[10px] ${mode==='light' ? 'bg-[#000000]' : 'bg-[#ffffff]'} rounded-full`}></div>
          <div className={`text-xl font-semibold w-[10px] h-[10px] ${mode==='light' ? 'bg-[#000000]' : 'bg-[#ffffff]'} rounded-full`}></div>
        </div>}
        {!friendSelect && !groupSelect && <Header />}
        <div>
          {!friendSelect && !groupSelect && <FriendList />}
          {friendSelect && <ChatSection />}
          {groupSelect && <GroupChat />}
        </div>
        {!friendSelect && !groupSelect && <BottomNavbar />}
      </div>

      <div className={`hidden md:flex ${mode === 'light' ? 'bg-[#f3f4f6]' : 'bg-[#1b507b]'}`}>
        <div className='h-screen flex flex-col gap-9 items-center justify-center w-[10%] max-w-[50px]'>
          <Link to="/" className={`flex flex-col gap-1 justify-center items-center cursor-pointer p-3 lg:p-4 aspect-square ${mode === 'light' ? 'hover:bg-gray-300' : 'hover:bg-[#fff]'}`}>
            <IoChatbox />
            <div className='text-[9px]'>Chats</div>
          </Link>
          <Link to="/ai-chat" className={`flex flex-col gap-1 justify-center items-center cursor-pointer p-3 lg:p-4 aspect-square ${mode === 'light' ? 'hover:bg-gray-300' : 'hover:bg-[#fff]'}`}>
            <TbMessageChatbot />
            <div className='text-[9px]'>AI</div>
          </Link>
          <div className={`flex flex-col gap-1 justify-center items-center cursor-pointer p-3 lg:p-4 aspect-square ${mode === 'light' ? 'hover:bg-gray-300' : 'hover:bg-[#fff]'}`} onClick={() => setGroup(!group)}>
            <MdTipsAndUpdates />
            <div className='text-[9px]'>Updates</div>
          </div>
          <Link to="/profile" className={`flex flex-col gap-1 justify-center items-center cursor-pointer p-3 lg:p-4 aspect-square ${mode === 'light' ? 'hover:bg-gray-300' : 'hover:bg-[#fff]'}`}>
            <FaUser />
            <div className='text-[9px]'>User</div>
          </Link>
        </div>

        <div className={`h-screen overflow-auto flex flex-col w-[35%] min-w-[270px] max-w-[400px] resize-x ${mode === 'light' ? 'bg-gray-100 text-black' : 'bg-[#1b507b] text-white'}`}>
          <Header />
          <FriendList />
        </div>

        <div className={`flex-1 ${mode === 'light' ? 'bg-gray-200 text-black' : 'bg-[#3d6da1] text-white'} min-w-[57%]`}>
          {!friendSelect && !groupSelect && (
            <div className='flex flex-col justify-center items-center h-screen text-xl font-semibold'>
              <div className='p-2 bg-white rounded-xl'>
                <IoIosChatbubbles className='text-4xl lg:text-5xl text-[#093d70]' />
              </div>
              <div className='text-center font-serif font-normal mt-4'>
                Welcome to Chit-Chat App
              </div>
              <p className='font-normal text-sm text-gray-400 mt-3'>
                Select a chat to start messaging
              </p>
            </div>
          )}
          {friendSelect && <ChatSection />}
          {groupSelect && <GroupChat />}
        </div>
      </div>
    </>
  );
};

export default Home;
