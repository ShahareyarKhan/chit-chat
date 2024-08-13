import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { IoClose } from 'react-icons/io5';

const GroupModal = ({ onClose }) => {
    const { friends, user , url} = useContext(UserContext);
    const [groupName, setGroupName] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);

    const handleGroupNameChange = (e) => setGroupName(e.target.value);
    
    const handleFriendSelect = (friendId) => {
        setSelectedFriends(prev =>
            prev.includes(friendId)
                ? prev.filter(id => id !== friendId)
                : [...prev, friendId]
        );
    };

    const handleSubmit = async () => {
        if (!groupName.trim() || selectedFriends.length === 0) {
            // Handle validation error
            alert('Group name and at least one member are required.');
            return;
        }

        try {
            const response = await fetch(`${url}/api/group/create`, { // Adjust endpoint as needed
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: groupName,
                    members: selectedFriends,
                    admin: user._id
                }),
            });

            if (response.ok) {
                // Handle success (e.g., show success message or update UI)
                console.log('Group created successfully.');
            } else {
                // Handle error
                console.error('Failed to create group.');
            }
        } catch (error) {
            console.error('Error creating group:', error);
        }

        onClose();
    };

    return (
        <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-4 rounded shadow-lg w-full max-w-md max-h-[400px] overflow-auto'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold'>Create Group</h2>
                    <IoClose className='cursor-pointer text-xl' onClick={onClose} />
                </div>
                <input
                    type='text'
                    className='w-full text-sm p-2 border outline-none border-gray-400 mb-4'
                    placeholder='Group Name'
                    value={groupName}
                    onChange={handleGroupNameChange}
                />
                {selectedFriends.length > 0 &&
                    <div className='flex gap-2'>
                        {selectedFriends.map((friendId) => (
                            <div key={friendId} className='flex items-center mb-2 text-sm bg-cyan-400 rounded-md'>
                                <span className='p-1 text-xs'>{friends.find(friend => friend._id === friendId).name}</span>
                            </div>
                        ))}
                    </div>
                }
                <div>
                    <span className='py-2'>Friends</span>
                    <hr className='border my-2 border-black' />
                    {friends.map((friend) => (
                        <div key={friend._id} className='flex items-center mb-2 text-sm'>
                            <input
                                type='checkbox'
                                checked={selectedFriends.includes(friend._id)}
                                onChange={() => handleFriendSelect(friend._id)}
                            />
                            <span className='ml-2'>{friend.name}</span>
                        </div>
                    ))}
                </div>
                <button
                    className='w-full p-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold rounded mt-4'
                    onClick={handleSubmit}
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default GroupModal;
