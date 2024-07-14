import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FaGoogle } from 'react-icons/fa';

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
        <div className=' w-[100%] mx-auto bg-white p-3 min-h-[100vh] flex flex-col justify-center px-9 '>
            <div onClick={() => window.history.back()} className="cursor-pointer absolute top-8">
                <IoMdArrowRoundBack className="text-2xl" />

            </div>

            <h1 className='text-2xl font-bold text-center my-5 '>Login </h1>

            <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4 mt-3 p-'>
                <div>
                    <input
                        type="email"
                        className='w-full border-b-2 border-gray-500 bg-transparent placeholder:text-gray-600 outline-none p-2'
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
                        className='w-full border-b-2 border-gray-500 bg-transparent placeholder:text-gray-600 outline-none p-2'
                        placeholder='Enter Password'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <a href="/api-auth-login-signup-forgot-password" className='flex justify-end font-semibold cursor-pointer hover:underline'>
                    Forgot password?
                </a>

                {error && <div className="text-red-500">{error}</div>}
                <div>
                    <input
                        type="submit"
                        className='w-full border border-gray-500  bg-white  placeholder:text-gray-600 outline-none cursor-pointer  hover:text-black p-2 hover:rounded-2xl my-2'
                        style={{ transition: "1s all ease" }}
                        value={loading ? 'Loading...' : 'Login'}
                        disabled={loading}
                    />
                </div>
            </form>
            <div className='flex gap-3 items-center justify-center p-2 mt-5 cursor-pointer rounded hover:rounded-xl border border-gray-300'>
                <div>
                    <FcGoogle className='text-2xl' />
                </div>
                <div className='text-sm' onClick={async () => {
                    await googleSignIn();
                    navigate('/');
                }}>
                    Login with Google
                </div>
            </div>

            <div className=' text-sm my-7 text-center flex justify-center gap-3'>
                <div>
                    New user?
                </div>
                <div>

                    <Link to="/register" className=' font-semibold hover:underline'>Create Account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
