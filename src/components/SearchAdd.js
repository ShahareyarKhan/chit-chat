import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router';
import FriendList from './FriendList';
import { IoClose } from 'react-icons/io5';

const SearchAdd = ({Srch, setsrch}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/api-auth-login-signup');
        }
    }, [navigate]);

    const { friends, request, acceptFriendRequest, sendFriendRequest } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://localhost:5000/api/auth/search?query=${searchTerm}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('token'),
                },
            });
            const data = await response.json();
            setSearchResults(data.users);
        } catch (error) {
            setError(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const isFriend = (userId) => friends.some(friend => friend.friendId._id === userId);

    return (
        <div className='w-[90%] max-w-[800px] mx-auto my-9'>
            <div className='text-3xl float-right'>
                <IoClose className='' onClick={() => setsrch(!Srch)}/>
            </div>
            <div>
                <h1 className='text-2xl font-semibold'>Search friends</h1>

                <div className='w-full flex border border-black my-2 rounded-sm'>
                    <input
                        type="text"
                        placeholder='Search'
                        className='outline-none w-full p-1 text-xl'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className='bg-[#a6b3e4] p-2 font-semibold hover:bg-[#0180ff67]'
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
                {error && <div className="text-red-500">{error}</div>}
            </div>
            <div>
                {loading ? (
                    <p className='text-center font-semibold'>Loading...</p>
                ) : searchResults.length > 0 ? (
                    searchResults.map((result) => (
                        <div key={result._id} className=' mx-auto my-2'>
                            <div className='text-left bg-[#0180ff67] hover:bg-[#0180ffca] cursor-pointer p-2 rounded flex justify-between items-center'>
                                <div className='flex flex-col justify-center'>

                                    <h1 className='lg:text-xl font-semibold'>{result.name}</h1>
                                    <p className='text-right text-sm text-gray-700'>{result.email}</p>
                                </div>
                                {!isFriend(result._id) && (
                                    <button
                                        className='font-semibold bg-green-600 p-2 text-black rounded'
                                        onClick={() => sendFriendRequest(result._id)}
                                    >
                                        Add
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <hr className='border border-black' />
                )}
            </div>
            <div>
                <h1 className='text-2xl font-semibold my-4'>Friend Requests</h1>

                {request.length > 0 ? (
                    request.map((req) => (
                        <div key={req._id} className=' mx-auto my-2 bg-[#0180ff67] p-1 rounded'>
                            <div className='text-left cursor-pointer p-2 rounded'>
                                <h1 className='lg:text-xl font-semibold'>{req.userId.name}</h1>
                                <p className='text-right text-sm text-gray-700'>{req.userId.email}</p>
                            </div>
                            <div className='flex gap-2 justify-between text-white mt-1'>
                                <div className='flex justify-center p-2 rounded bg-red-700 w-1/2 cursor-pointer'>
                                    Decline
                                </div>
                                <div
                                    className='flex justify-center p-2 rounded bg-green-700 w-1/2 cursor-pointer'
                                    onClick={() => acceptFriendRequest(req.userId._id)}
                                >
                                    Accept
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No friend requests found</p>
                )}
            </div>
        </div>
    );
};

export default SearchAdd;
