import React, { useState } from 'react'
import Login from '../Authentication/Login'
import Register from '../Authentication/Register'

const Authenticate = () => {
    const [login, setlogin] = useState(true);
    return (
        <div className='min-h-screen flex items-center justify-center w-full'>
            <div className=' w-[90%] max-w-[700px] mx-auto'>
                <div className='text-center text-3xl font-bold p-3 rounded bg-[#31455a]'>
                    IChat
                </div>
                <div className='my-4 bg-[#31455a] rounded p-9'>
                    <div className='flex justify-between gap-2 '>
                        <div className={`w-1/2 text-center p-3 font-semibold text-xl bg-[#d6f1db] cursor-pointer rounded ${login === true ? "boxi" : ""}`} onClick={() => {
                            setlogin(true)
                        }}>Login</div>
                        <div className={`w-1/2 text-center p-3 font-semibold text-xl bg-[#d6f1db] rounded cursor-pointer ${login !== true ? "boxi" : ""}`} onClick={() => {
                            setlogin(false)
                        }}>Register</div>
                    </div>

                    {login === true ? <Login /> : <Register />}
                </div>

            </div>
        </div>
    )
}

export default Authenticate