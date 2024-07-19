import React, { useContext, useEffect } from 'react';
import { IoMdArrowRoundBack, IoMdLogOut } from 'react-icons/io';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router';

const Profile = () => {
    const navigate = useNavigate();
    const { user, friends } = useContext(UserContext);

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
        <div className='h-screen flex justify-center items-center flex-col bg-[#ffffff38]'>
            <div className='w-[80%] max-w-[500px] mx-auto  p-8 relative bg-white rounded-lg'>
                <div onClick={() => window.history.back()} className="cursor-pointer absolute top-8">
                    <IoMdArrowRoundBack className="text-2xl" />
                </div>
                <h1 className='text-2xl  font-semibold my-5 text-center'>Profile</h1>

                <div className='flex justify-center my-3 text-xl'>
                    {user.pic != "" ? (<img src={user.pic} className='rounded-full max-w-[80px]' alt="Profile" />) : (<div className='rounded-full bg-white w-10 h-10 flex items-center justify-center font-bold text-2xl'>{user.name[0]}</div>)}
                </div>
                <p className='text-center my-3  font-semibold'>{user.name}</p>
                <p className='text-center my-3  text-sm'>Email: {user.email}</p>
                <p className='text-center my-3  text-sm'>Total Friends: {friends.length}</p>
                <div
                    onClick={handleLogout}  // Added onClick handler
                    className='py-2 w-full  text-center inline-flex mx-auto  items-center gap-3 px-3 my-6 justify-center text-sm'
                    style={{ transition: "0.5s all linear" }}
                >
                    <div className=' bg-[#79daeb] rounded cursor-pointer hover:rounded-xl hover:bg-[#a4e8f4] flex items-center p-2 px-6 gap-4'>

                    <div>

                        Log out
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
