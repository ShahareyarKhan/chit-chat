import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './components/Home';
import Login from './Authentication/Login';
import Register from './Authentication/Register';
import Forgot_Password from './Authentication/Forgot_Password';
import ChatSection from './components/ChatSection';
import ChatAI from './components/ChatAI';
import Profile from './components/Profile';
import VideoCall from './components/VideoCall';

import socketIO from 'socket.io-client';

const socket = socketIO.connect('https://chit-chat-api-lilac.vercel.app/');

const App = () => {
  return (
    <div className='w-full'>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/chat/:id' element={<ChatSection socket={socket} />} />
          <Route path='/api-auth-login-signup-forgot-password' element={<Forgot_Password />} />
          <Route path='/ai-chat' element={<ChatAI />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/video-call' element={<VideoCall />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
