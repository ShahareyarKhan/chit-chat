import React, { useEffect } from 'react'
import FriendList from './FriendList'
import Authenticate from '../Authentication/Authenticate'
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
      <Header />

      <div >
        <FriendList />
      </div>

      <BottomNavbar />

    </div>
  )
}

export default Home
