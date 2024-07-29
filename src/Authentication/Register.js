import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { FcGoogle } from "react-icons/fc";
import { IoMdArrowRoundBack } from 'react-icons/io';

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

        <div className='h-[100vh] flex items-center'>
            <div className=' w-[100%] mx-auto bg-[#ffffffbd] p-3 min-h-screen  md:min-h-[80vh] flex flex-col justify-center px-9 max-w-[500px] relative '>
                <div onClick={() => window.history.back()} className="cursor-pointer absolute top-8">
                    <IoMdArrowRoundBack className="text-2xl" />
                </div>

                <h1 className='text-2xl font-bold text-center my-5 '>Register to Chit-Chat </h1>

                <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4 mt-3 p-'>
                    <div>
                        <input
                            type="text"
                            className='w-full border-b-2 border-gray-700 bg-transparent placeholder:text-gray-600 outline-none p-2'
                            placeholder='Enter Name'
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            className='w-full border-b-2 border-gray-700 bg-transparent placeholder:text-gray-600 outline-none p-2'
                            placeholder='Enter Email'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            className='w-full border-b-2 border-gray-700 bg-transparent placeholder:text-gray-600 outline-none p-2'
                            placeholder='Enter Password'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            className='w-full border-b-2 border-gray-700 bg-transparent placeholder:text-gray-600 outline-none p-2'
                            placeholder='Confirm Password'
                            required
                            value={cpassword}
                            onChange={(e) => setCpassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="submit"
                            className='w-full border border-gray-500 bg-white placeholder:text-gray-600 outline-none cursor-pointer hover:text-black p-2 hover:rounded-2xl my-2'
                            style={{ transition: "0.3s all ease" }}
                            value={loading ? 'Loading...' : 'Register'}
                            disabled={loading}
                        />
                    </div>
                </form>
                <div className='flex gap-3 items-center justify-center p-2 mt-5 cursor-pointer rounded hover:rounded-xl border border-gray-300' onClick={async () => {
                    await googleSignIn();
                    navigate('/');
                }}>
                    <div>
                        <FcGoogle className='text-2xl' />
                    </div>
                    <div className='text-sm' >
                        Sign up with Google
                    </div>
                </div>

                <div className='text-sm my-7 text-center flex justify-center gap-3'>
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
