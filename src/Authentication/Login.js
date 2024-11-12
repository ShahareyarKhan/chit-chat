import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { IoIosChatbubbles } from "react-icons/io";
// import Alert from '../components/Alert';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginUser, error, loading, googleSignIn } = useContext(UserContext);
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await loginUser(email, password);
        if (!error) {
            navigate('/');
        }
    };


    return (
        <div className='h-[100vh] w-full bg-[#071039] flex items-center'>
            <div className=' w-[90%] mx-auto bg-[#0c1a45] p-10 md:min-h-[80vh] flex flex-col justify-center px-9 max-w-[450px] md:max-w-[500px] relative rounded-xl border border-[#01040a]' >
                
                <h1 className='text-xl md:text-2xl  text-cyan-400 font-bold md:font-bold text-center my-5 '>
                    Login to Chit-Chat
                </h1>

                <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4 mt-3 '>
                    <div>
                        <input
                            type="email"
                            className='w-full border-b border-gray-300 bg-transparent placeholder:text-gray-400 outline-none p-2 text-white'
                            placeholder='Enter Email'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete='off'
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            className='w-full border-b border-gray-300 bg-transparent placeholder:text-gray-400 outline-none p-2 text-white'
                            placeholder='Enter Password'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <a href="/api-auth-login-signup-forgot-password" className='flex justify-end font-semibold text-sm cursor-pointer text-red-600 hover:underline'>
                        Forgot password?
                    </a>

                    <div>
                        <input
                            type="submit"
                           className='w-full border border-gray-300 bg-transparent  outline-none p-2 text-white text-sm hover:rounded-xl cursor-pointer'
                            style={{ transition: "1s all ease" }}
                            value={loading ? 'Loading...' : 'Login'}
                            disabled={loading}
                        />
                    </div>
                </form>
                <div className='flex gap-3 items-center justify-center p-2 mt-5 cursor-pointer rounded hover:rounded-xl border border-gray-300 bg-white' onClick={async () => {
                    await googleSignIn();
                    navigate('/');
                }} style={{ transition: "1s all ease" }}>
                    <div>
                        <FcGoogle className='text-2xl' />
                    </div>
                    <div className='text-sm' >
                        Login with Google
                    </div>
                </div>

                <div className=' text-xs md:text-sm text-white my-7 text-center flex justify-center gap-3'>
                    <div>
                        New user?
                    </div>
                    <div>

                        <Link to="/register" className=' font-semibold hover:underline'>Create Account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
