import React, { useContext, useEffect } from 'react'
import FriendList from './FriendList'
import Header from './Header'
import BottomNavbar from './BottomNavbar'
import { useNavigate } from 'react-router'
import { UserContext } from '../context/UserContext'
import ChatSection from './ChatSection'
const Home = () => {
  const navigate = useNavigate()
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
    }
  })

  const { friendSelect, setFriendSelect } = useContext(UserContext);
  return (
    <>
      <div className='h-[100vh] flex flex-col md:hidden '>
        <div className={`${friendSelect === null ? 'block' : 'hidden'} z-50`}>
          <Header />
        </div>
        <div className='z-40 '>
          <div className={`${friendSelect === null ? 'block' : 'hidden'}`}>

            <FriendList />
          </div>
          {friendSelect && <div className=' bg-red-900'>
            <ChatSection friendId={friendSelect._id} />
          </div>}
        </div>
        <BottomNavbar />
      </div>

      <div className='hidden md:block w-full '>
        <div className='flex w-full '>
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
              (<ChatSection friendId={friendSelect._id} />)
              : <div className='flex justify-center items-center h-screen text-white text-xl font-semibold '>Welcome to Chit-Chat App</div>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
