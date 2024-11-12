import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';

const FriendList = () => {
  const { friends, setFriendSelect, setGroupSelect,url } = useContext(UserContext);
  const { user, mode, setmode } = useContext(UserContext);
  // const [hoveredFriend, setHoveredFriend] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user || !user._id) return;

      try {
        const response = await fetch(`${url}/api/group/${user._id}/groups`, {
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
    <div className=' flex flex-col gap-2 pb-10 px-5 md:px-3 w-full my-4 '>
  
      {friends.map((friend) => (
        <div
          key={friend._id}
          className={`${mode==='light' ? 'bg-[#28dfff] ' : 'bg-[#000000]'} friendbox cursor-pointer overflow-hidden hover:rounded-xl  rounded w-full flex items-center  p-3`}
          onClick={() => {setFriendSelect(friend); setGroupSelect(null);}} style={{transition:"0.3s all ease-in"}}
        >
          <div className='flex gap-3 items-center'>
            <div>
              {friend.pic ? (
                <img src={friend.pic} alt="" className='w-10 h-10 rounded-full' />
              ) : (
                <div className='w-10 h-10 rounded-full  flex items-center justify-center text-2xl font-bold'>
                  {friend.name[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className='flex justify-center flex-col '>
              <div className='text-sm font-semibold'>{friend.name}</div>
              <div className='text-xs'>{friend.email}</div>
            </div>
          </div>
        </div>
      ))}

      {groups.map((group) => (
        <div
          key={group._id}
          className={`  cursor-pointer overflow-hidden hover:rounded-xl rounded  p-3 w-full ${mode==='light' ? 'bg-[#28dfff] ' : 'bg-[#000000]'} friendbox `}
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
