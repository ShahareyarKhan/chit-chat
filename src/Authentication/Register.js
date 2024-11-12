import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { FcGoogle } from "react-icons/fc";
import { IoMdArrowRoundBack } from 'react-icons/io';
import { IoIosChatbubbles } from "react-icons/io";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const { registerUser, error, loading, googleSignIn } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== cpassword) {
            alert("Passwords do not match!");
            return;
        }
        await registerUser(name, email, password, '');
        if (!error) {
            navigate('/');
        }
    };

    return (
        <div className='h-[100vh] w-full bg-[#071039] flex items-center'>
            <div className=' w-[90%] mx-auto bg-[#0c1a45] p-10 md:min-h-[80vh] flex flex-col justify-center px-9 max-w-[450px] md:max-w-[500px] relative rounded-xl border border-[#01040a]' >

                <h1 className='text-2xl  text-cyan-400 font-bold md:font-bold text-center my-5 '>
                    Register to Chit-Chat
                </h1>

                <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4 mt-3 p-'>
                    <div>
                        <input
                            type="text"
                            className='w-full border-b border-gray-300 bg-transparent placeholder:text-gray-400 outline-none p-2 text-white'
                            placeholder='Enter Name'
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                    <div>
                        <input
                            type="password"
                            className='w-full border-b border-gray-300 bg-transparent placeholder:text-gray-400 outline-none p-2 text-white'
                            placeholder='Confirm Password'
                            required
                            value={cpassword}
                            onChange={(e) => setCpassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="submit"
                            className='w-full border border-gray-300 bg-transparent  outline-none p-2 text-white text-sm hover:rounded-xl cursor-pointer'
                            style={{ transition: "1s all ease" }}
                            value={loading ? 'Loading...' : 'Register'}
                            disabled={loading}
                        />
                    </div>
                </form>

                <div className='flex gap-3 items-center justify-center p-2 mt-5 cursor-pointer rounded hover:rounded-xl border border-gray-300 bg-white'
                    onClick={async () => {
                        await googleSignIn();
                        navigate('/');
                    }}>
                    <div>
                        <FcGoogle className='text-2xl' />
                    </div>
                    <div className='text-sm'>
                        Sign up with Google
                    </div>
                </div>

                <div className=' text-sm text-white my-7 text-center flex justify-center gap-3'>
                    <div>Already have an account?</div>
                    <div>
                        <Link to="/login" className='font-semibold hover:underline'>Login Account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
