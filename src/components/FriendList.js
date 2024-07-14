import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Link } from 'react-router-dom'
const FriendList = () => {
    const { friends } = useContext(UserContext)


    return (
        <div className='min-h-[10px] flex flex-col gap-2 pb-24 px-5 p-5 w-full'>
            {friends.map((friend) => (
                <Link to={`/chat/${friend._id}`} key={friend._id} className="bg-[#295789] transform user-select-none cursor-pointer hover:rounded-2xl hover:shadow-xl rounded text-black p-2 w-full z-40">
                    <div className='flex gap-3 items-center'>

                        <div>
                            {friend.pic && <img src={friend.pic} alt="" className='w-10 h-10 rounded-full' />}
                            {!friend.pic && <div className='w-10 h-10 rounded-full bg-white flex items-center justify-center text-2xl font-bold' >{friend.name[0].toUpperCase()}</div>}
                        </div>
                        <div className='flex justify-center flex-col'>

                            <div className='text-sm font-semibold'>
                                {friend.name}
                            </div>
                            <div className='text-xs text-gray-300'>
                                {friend.email}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}


        </div>
    )
}

export default FriendList
