import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';

const FriendList = () => {
  const { friends, setFriendSelect } = useContext(UserContext);
  const [hoveredFriend, setHoveredFriend] = useState(null);

  return (
    <div className='min-h-[10px] flex flex-col gap-2 pb-24 px-5 md:px-3 w-full my-4'>
      {friends.map((friend) => (
        <div
          key={friend._id}
          className={`bg-[#79cffa] border-[1px] border-cyan-300 cursor-pointer overflow-hidden hover:rounded-xl hover:shadow-xl rounded text-black p-3 w-full ${hoveredFriend && hoveredFriend !== friend ? 'opacity-80' : ''}`}
          onClick={() => setFriendSelect(friend)}
          onMouseEnter={() => setHoveredFriend(friend)}
          onMouseLeave={() => setHoveredFriend(null)}
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
    </div>
  );
};

export default FriendList;
