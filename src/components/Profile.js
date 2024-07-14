import React, { useContext, useEffect } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router';

const Profile = () => {
    const navigate = useNavigate();
    const { user, } = useContext(UserContext);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        // Call the logout function
        localStorage.removeItem('token');
        navigate('/login');
    }

    // Ensure that `user` is not null before trying to access its properties
    if (!user) {
        return <p>Loading...</p>;  // Show a loading message or spinner
    }

    return (
        <div className='h-screen flex justify-center items-center flex-col'>
            <div className='w-[90%] max-w-[700px] mx-auto bg-[#ffffff38] p-8 rounded-lg border border-green-300 relative'>
                <div onClick={() => window.history.back()} className="cursor-pointer absolute top-8">
                    <IoMdArrowRoundBack className="text-2xl" />
                </div>
                <h1 className='text-3xl font-semibold my-7 text-center'>Profile</h1>

                <div className='flex justify-center my-3 text-xl'>
                    {user.pic != "" ? (<img src={user.pic} className='rounded-full' alt="Profile" />) : (<div className='rounded-full bg-white w-10 h-10 flex items-center justify-center font-bold text-2xl'>{user.name[0]}</div>)}
                </div>
                <p className='text-center my-3  font-semibold'>{user.name}</p>
                <p className='text-center my-3  text-sm'>Email: {user.email}</p>

                <div
                    onClick={handleLogout}  // Added onClick handler
                    className='w-[90px] py-2 text-center border border-green-400 my-6 mx-auto text-sm bg-[#d6f1db59] rounded cursor-pointer hover:rounded-xl hover:bg-[#d6f1db]'
                    style={{ transition: "0.5s all linear" }}
                >
                    Log out
                </div>
            </div>
        </div>
    );
}

export default Profile;
