import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../context/UserContext';
const Forgot_Password = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPassword1, setNewPassword1] = useState('');
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
    const [load, setLoad] = useState(false);
    let navigate = useNavigate();
    const {url}=useContext(UserContext);
    
    const handleSendOtp = async (e) => {
        e.preventDefault();

        try {
            setLoad(true);
            const response = await fetch(`${url}/api/auth/forgotpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to send OTP');
            }

            const data = await response.json();

            setMessage(data.message);
            setStep(2);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoad(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${url}/api/auth/resetpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, newPassword, newPassword1 }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to reset password');
            }
            const data = await response.json();
            setMessage(data.message);
            navigate('/loginsignup');
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className=' w-[100%] mx-auto bg-white p-3 min-h-[100vh] flex flex-col justify-center px-9 '>
            {step === 1 ? (
                <div className='h-[90vh] flex flex-col justify-center items-center mx-auto w-full'>
                    {load && <div className='my-6'>Loading...</div>}
                    <form className='w-full' onSubmit={handleSendOtp}>
                        <h2 className='text-3xl font-bold text-center'>Forgot Password</h2>
                        <div className='w-full my-9'>
                            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className='w-full border-b-2 my-4 outline-none border-black px-2 p-1 ' required />
                        </div>
                        <button type='submit' className='w-full bg-indigo-400 p-2 px-4 border-2 border-black' disabled={load}>Send OTP</button>
                    </form>
                </div>
            ) : (
                <div className='h-[90vh] flex flex-col justify-center items-center mx-auto w-full'>
                    {load && <div className='my-6'>Loading...</div>}
                    <form className='w-full' onSubmit={handleResetPassword}>
                        <h2 className='text-3xl font-bold text-center'>Reset Password</h2>
                        <p className='my-6 text-center  font-semibold text-red-700'>{message}</p>
                        <div className='w-full my-9'>
                            <input type="otp" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className='border-b-2 my-2  border-black px-2 p-1 w-full outline-none' required minLength={4} maxLength={4} />
                        </div>
                        <div>
                            <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className='border-b-2 my-2  border-black px-2 p-1 w-full outline-none' minLength={8} required />
                        </div>
                        <div className='my-9'>
                            <input type="password" placeholder="Confirm password" value={newPassword1} onChange={(e) => setNewPassword1(e.target.value)} className='border-b-2 my-2  border-black px-2 p-1 w-full outline-none' required minLength={8} />
                        </div>
                        <button type='submit' className='w-full bg-indigo-400 p-2 px-4 border-2 border-black' disabled={load}>Reset Password</button>
                    </form>
                </div>
            )}
        </div>
    )
};

export default Forgot_Password