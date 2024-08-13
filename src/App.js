import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './components/Home';
import Login from './Authentication/Login';
import Register from './Authentication/Register';
import Forgot_Password from './Authentication/Forgot_Password';
import ChatAI from './components/ChatAI';
import Profile from './components/Profile';
import io from 'socket.io-client'; // Correct import

// const socket = io('wss://chit-chat-api-lilac.vercel.app/socket.io/?EIO=4', {
//   transports: ['websocket']
// });


const App = () => {
  return (
    <div className='w-full'>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/api-auth-login-signup-forgot-password' element={<Forgot_Password />} />
          <Route path='/ai-chat' element={<ChatAI />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
