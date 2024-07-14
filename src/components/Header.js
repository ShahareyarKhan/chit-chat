import React, { useState, useContext } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { UserContext } from '../context/UserContext';
import { IoPersonAdd, IoNotifications, IoClose } from "react-icons/io5";
import { TiTick } from "react-icons/ti";

const Header = () => {

    const { searchUsers, searchResults, request, sendFriendRequest, acceptFriendRequest } = useContext(UserContext);
    const [query, setQuery] = useState('');
    const [noti, setNoti] = useState(false);

    const handleSearch = async (e) => {
        setQuery(e.target.value);
        if (e.target.value.trim() !== '') {
            await searchUsers(e.target.value);
        }
    };

    

    return (
        <nav className='sticky top-0 shadow-md'>
            <div className='flex justify-between items-center p-2 px-9'>
                <div className='text-xl font-semibold flex items-center gap-2'>
                    <span>Chit-Chat</span>
                </div>
                <div className='threedot p-3 rounded-full flex gap-5'>
                    <div className='relative'>
                        <IoNotifications className='text-xl' onClick={() => setNoti(!noti)} />
                        {request?.pendingRequests?.length > 0 && (
                            <div className='w-4 h-4 flex justify-center items-center bg-red-600 text-white rounded-full absolute top-[-10px] right-[-7px] text-xs '>
                                {request.pendingRequests.length}
                            </div>
                        )}
                    </div>
                    <BsThreeDotsVertical className='text-xl' />
                </div>
            </div>
            <div className='w-full px-9 pb-4'>
                <input
                    type="text"
                    className='border border-gray-300 outline-none bg-[#295789] w-full p-2 text-black placeholder:text-gray-300 rounded-xl'
                    placeholder='Search users...'
                    value={query}
                    onChange={handleSearch}
                />
            </div>
            <div className='px-9 mb-3'>
                {searchResults.length > 0 && query.trim() !== '' && (
                    <ul className='bg-[#dbe6f000] shadow-md rounded border border-[#043952] '>
                        {searchResults.map((result) => (
                            <li key={result._id} className='p-3 flex justify-between items-center hover:bg-[#043952] text-gray-300 cursor-pointer relative' >
                                <div className='flex items-center gap-2'>
                                    {result.pic ? (
                                        <img src={result.pic} className='w-8 h-8 rounded-full' alt={result.name} />
                                    ) : (
                                        <div className='w-8 h-8 rounded-full flex items-center justify-center bg-gray-300'>{result.name[0]}</div>
                                    )}
                                    <div>
                                        <div>{result.name}</div>
                                        <div className='text-xs'>{result.email}</div>
                                    </div>
                                </div>
                                <div className='text-sm font-semibold'>
                                    <IoPersonAdd className='text-xl' onClick={() => sendFriendRequest(result._id)} />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {noti && (
                <div className='bg-white w-[70%] md:w-[50%] max-w-[400px] h-[80vh] overflow-auto absolute top-14 rounded right-3 p-3 z-50'>
                    <div>
                        <IoClose className='text-2xl absolute top-3 right-3 text-gray-600' onClick={() => setNoti(false)} />
                    </div>
                    <div className='text-gray-700'>Notifications</div>
                    <hr className='text-black border border-black my-3' />
                    {request?.pendingRequests?.length > 0 ? (

                        request.pendingRequests.map((req) => (
                            <div key={req._id} className='flex justify-between items-center text-black'>
                                <div className='flex items-center gap-3'>

                                    <div>
                                        <div className='font-semibold text-sm'>{req.userId.name}</div>
                                        <div className='text-xs'>{req.userId.email}</div>
                                    </div>
                                </div>
                                <div className='text-sm font-semibold flex gap-2'>
                                    <IoClose className='text-xl bg-red-400 w-6 h-6' />
                                    <TiTick className='text-xl bg-green-400 w-6 h-6' onClick={() => acceptFriendRequest(req._id)} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='text-center'>No Notifications</div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Header;
