import React, { useEffect } from 'react'
import FriendList from './FriendList'
import Header from './Header'
import BottomNavbar from './BottomNavbar'
import { useNavigate } from 'react-router'

const Home = () => {
  const navigate = useNavigate()
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
    }
  })
  return (
    <div className='h-[100vh] flex flex-col  '>
      <div className='z-50'>

      <Header />
      </div>

      <div className='z-40'>
        <FriendList />
      </div>

      <BottomNavbar />

    </div>
  )
}

export default Home
