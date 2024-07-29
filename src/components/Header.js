import React, { useState, useContext, useRef, useEffect } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { UserContext } from '../context/UserContext';
import { IoPersonAdd, IoNotifications, IoClose, IoSettings } from "react-icons/io5";
import { TiTick } from "react-icons/ti";

const Header = () => {
    const { searchUsers, searchResults, request, sendFriendRequest, acceptFriendRequest, friends, setFriendSelect } = useContext(UserContext);
    const [query, setQuery] = useState('');
    const [noti, setNoti] = useState(false);
    const [options, setOptions] = useState(false);
    const optionsRef = useRef(null);
    const notiRef = useRef(null);
    const searchInputRef = useRef(null);
    const [srchBox, setSrchBox] = useState(false);

    const handleSearch = async (e) => {
        setSrchBox(true);
        setQuery(e.target.value);
        if (e.target.value.trim() !== '') {
            await searchUsers(e.target.value);
        }
    };

    const handleClickOutside = (event) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
            setOptions(false);
        }
        if (notiRef.current && !notiRef.current.contains(event.target)) {
            setNoti(false);
        }
        if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
            setSrchBox(false);
        }
        // Close chat section if clicked outside
        setFriendSelect(null);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const isFriend = (userId) => {
        return friends.some(friend => friend._id === userId);
    };

    const handleAddFriend = async (userId) => {
        await sendFriendRequest(userId);
    };

    const handleFriendClick = (friend) => {
        // Open chat section for the selected friend
        setFriendSelect(friend);
    };

    return (
        <nav className='sticky top-0 shadow-md'>
            <div className='flex justify-between items-center p-2 px-9 md:px-5'>
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
                    <IoSettings className='text-xl' />

                </div>
            </div>
            <div className='w-full px-9 md:px-5 pb-4'>
                <input
                    ref={searchInputRef}
                    type="text"
                    className='outline-none bg-[#ffffff] w-full p-2 rounded px-2 text-black placeholder:text-gray-700'
                    placeholder='Search users...'
                    value={query}
                    onChange={handleSearch}
                />
            </div>
            <div className='mb-3 w-full  px-9 md:px-5 pb-4 absolute' ref={srchBox ? searchInputRef : null}>
                {searchResults.length > 0 && query.trim() !== '' && srchBox && (
                    <ul className='bg-[#dbe6f000] bg-white text-black z-50 shadow-md  w-full text-sm  p-3 max-h-[400px] overflow-auto'>
                        {searchResults.map((result) => (
                            <li key={result._id} className='px-3 p-2 my-2 border border-gray-400 flex justify-between items-center hover:bg-[#9cd7f3] cursor-pointer relative'>

                                <div className='text-sm  w-full'>
                                    {!isFriend(result._id) && (
                                        <div className='flex w-full items-center justify-between gap-2'>
                                            <div className='flex items-center gap-5 w-[70%] overflow-auto'>
                                                {result.pic ? (
                                                    <img src={result.pic} className='w-8 h-8 rounded-full' alt={result.name} />
                                                ) : (
                                                    <div className='w-8 h-8 rounded-full flex items-center justify-center bg-gray-300'>{result.name[0]}</div>
                                                )}
                                                <div>
                                                    <div className='text-xs'>{result.name}</div>
                                                    <div className='text-[10px]'>{result.email}</div>
                                                </div>
                                            </div>
                                            <IoPersonAdd onClick={() => handleAddFriend(result._id)} />
                                        </div>
                                    )}
                                    {isFriend(result._id) && (
                                        <div className='flex items-center gap-2 w-full justify-between' onClick={() => setFriendSelect(result)}>
                                            <div className='flex items-center gap-5 w-[70%] overflow-auto'>
                                                {result.pic ? (
                                                    <img src={result.pic} className='w-8 h-8 rounded-full' alt={result.name} />
                                                ) : (
                                                    <div className='w-8 h-8 rounded-full flex items-center justify-center bg-gray-300'>{result.name[0]}</div>
                                                )}
                                                <div>
                                                    <div className='text-xs'>{result.name}</div>
                                                    <div className='text-[10px]'>{result.email}</div>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-2 text-cyan-500 text-xs' >
                                                Friends
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {noti && (
                <div ref={notiRef} className='bg-white h-[80vh] w-[80%] md:w-full max-w-[450px] md:h-[100vh] overflow-auto absolute z-50 top-14 md:top-0 p-3 right-3 md:right-0'>
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
