import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';

const FriendList = () => {
  const { friends, setFriendSelect, setGroupSelect } = useContext(UserContext);
  const { user } = useContext(UserContext);
  const [hoveredFriend, setHoveredFriend] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user || !user._id) return;

      try {
        const response = await fetch(`http://localhost:5000/api/group/${user._id}/groups`, {
          method: 'GET'
        });

        if (!response.ok) {
          throw new Error(`Error: ${response}`);
        }
        const data = await response.json();
        setGroups(data.groups);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGroups();
  }, [user]);

  return (
    <div className='min-h-[10px] flex flex-col gap-2 pb-24 px-5 md:px-3 w-full my-4 '>
  
      {friends.map((friend) => (
        <div
          key={friend._id}
          className={`bg-[#62b2da] friendbox cursor-pointer overflow-hidden hover:rounded-xl  rounded text-black p-3 w-full `}
          onClick={() => {setFriendSelect(friend); setGroupSelect(null);}}
        >
          <div className='flex gap-3 items-center'>
            <div>
              {friend.pic ? (
                <img src={friend.pic} alt="" className='w-10 h-10 rounded-full' />
              ) : (
                <div className='w-10 h-10 rounded-full bg-white flex items-center justify-center text-2xl font-bold'>
                  {friend.name[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className='flex justify-center flex-col'>
              <div className='text-sm font-semibold'>{friend.name}</div>
              <div className='text-xs'>{friend.email}</div>
            </div>
          </div>
        </div>
      ))}

      {groups.map((group) => (
        <div
          key={group._id}
          className={`bg-[#000000]  cursor-pointer overflow-hidden hover:rounded-xl rounded text-white p-3 w-full `}
          onClick={() => {setGroupSelect(group); setFriendSelect(null);}}
        >
          <div className='flex gap-3 items-center'>
            <div className='w-10 h-10 rounded-full bg-white text-black flex items-center justify-center text-2xl font-bold'>
              {group.name[0].toUpperCase()}
            </div>
            <div className='flex justify-center flex-col'>
              <div className='text-sm font-semibold'>{group.name}</div>
              <div className='text-xs'>{`Members: ${group.members.length}`}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendList;
