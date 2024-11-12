import React, { useContext, useEffect, useState } from 'react';
import { IoMdArrowRoundBack, IoMdLogOut } from 'react-icons/io';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router';

const Profile = () => {
    const navigate = useNavigate();
    const { user, friends, mode, removeFriend, setmode } = useContext(UserContext); 
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    const [allFriends, setAllFriends] = useState([]);

    const fetchAllFriends = async () => {
        try {
            const response = await fetch(`https://chit-chat-api-lilac.vercel.app/api/friend/all-friends/${user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            setAllFriends(data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAllFriends();
        }
    }, [allFriends, user]);

    // Ensure that `user` is not null before trying to access its properties
    if (!user) {
        return <p className='text-center my-7'>Loading ...</p>;  // Show a loading message or spinner
    }

    return (
        <div className={`h-screen flex justify-center items-center flex-col ${mode === "light" ? "bg-white" : "bg-black"} `}>
            <div className='w-[90%] max-w-[500px] mx-auto p-8 relative bg-[#b7c6e3] rounded '>
                <div onClick={() => window.history.back()} className="cursor-pointer absolute top-8">
                    <IoMdArrowRoundBack className="text-2xl" />
                </div>
                <h2 className='text-2xl font-semibold my-5 text-center'>Profile</h2>

                <div className='flex flex-col md:flex-row  gap-4'>
                    <div className='flex justify-center my-3 text-xl'>
                        {user && user.pic  ? (
                            <img src={user.pic} className='rounded-full aspect-square h-[60px] w-[60px]' alt="Profile" />
                        ) : (
                            <div className='rounded-full bg-white w-10 h-10 flex items-center justify-center font-bold text-2xl'>
                                {user.name[0]}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className='my-3 font-semibold'>{user.name}</p>
                        <p className='my-3 text-sm md:text-md'>Email: {user.email}</p>
                        <div className='flex justify-between items-center '>
                            <p className='my-3 text-sm md:text-md'>Friends: {friends.length}</p>
                            <button className='text-sm md:text-md flex items-center gap-1 bg-red-400 p-1 px-2 rounded font-semibold' onClick={()=>{
                                handleLogout();
                            }}>Logout</button>
                        </div>
                    </div>
                </div>

                <div>
                    <div className='py-2'>Friends</div>
                    <hr />
                    <div>
                        <div className='flex flex-col items-center gap-2 max-h-[500px] overflow-auto py-2'>
                            {allFriends && allFriends.map((fri) => (
                                <div key={fri._id} className='w-full flex justify-between items-center gap-2 bg-white p-2 rounded'>
                                    <div className='flex flex-col text-sm font-semibold'>
                                        <div>{fri.name} </div>
                                        <div className='text-xs font-normal'>{fri.email}</div>
                                    </div>
                                    <div className='flex justify-center text-xs hover:underline cursor-pointer' onClick={ () => {removeFriend(fri._id)}}>
                                        Unfriend
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
