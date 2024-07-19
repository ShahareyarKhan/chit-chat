import React, { createContext, useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export const UserContext = createContext();

const firebaseConfig = {
    apiKey: "AIzaSyBFdZHxXVg_RZVkJLMfSHogIsOWaorjGJ0",
    authDomain: "chit-chat-2439e.firebaseapp.com",
    projectId: "chit-chat-2439e",
    storageBucket: "chit-chat-2439e.appspot.com",
    messagingSenderId: "643840074944",
    appId: "1:643840074944:web:49144b524add397e8db925"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const UserProvider = ({ children }) => {
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [request, setRequest] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const loginUser = async (email, uid) => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password: uid })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            localStorage.setItem('token', data.authtoken);
            localStorage.setItem('data', JSON.stringify(data.user));
            setUser(data.user);
            await fetchFriends(data.user._id);
        } catch (error) {
            setError(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const registerUser = async (name, email, password, pic) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/createuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, pic })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }
            alert('User created successfully.');
        } catch (error) {
            console.error('Error creating user:', error);
            setError(error.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const googleSignIn = async () => {
        setLoading(true);
        setError(null);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const name = user.displayName;
            const email = user.email;
            const pic = user.photoURL;
            const uid = user.uid;

            await registerUser(name, email, uid, pic);
            await loginUser(email, uid);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchFriends = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/friend/${userId}`, {
                method: 'GET',
            });
            const data = await response.json();
            setFriends(data);
        } catch (error) {
            setError('Failed to fetch friends');
        }
    };

    const fetchRequest = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/friend/requests/${userId}`, {
                method: 'GET',
            });
            const data = await response.json();
            setRequest(data);
            // console.log(request);
        } catch (error) {
            setError('Failed to fetch friend requests');
        }
    };

    const fetchUserDetails = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch('http://localhost:5000/api/auth/user', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': token
                    }
                });
                const data = await response.json();
                setUser(data.user);
                await fetchFriends(data.user._id);
                await fetchRequest(data.user._id);
            } catch (error) {
                setError('Failed to fetch user details');
            }
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const sendFriendRequest = async (friendId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/friend/add`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    // 'authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ friendId, userId: user._id }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to send friend request');
            }
            alert('Friend request sent successfully.');
        } catch (error) {
            setError('Failed to send friend request');
        }
    };
    const acceptFriendRequest = async (requestId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/friend/accept`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: requestId }),
            });
            if (response.ok) {
                // console.log(request);
                // setRequest(prevRequests => prevRequests.filter(req => req._id !== requestId));
                await fetchFriends(user._id);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const[friendSelect, setFriendSelect]=useState(null);
    const searchUsers = async (query) => {
        try {
            const response = await fetch(`http://localhost:5000/api/auth/search?query=${query}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('token')
                }
            });
            const data = await response.json();
            setSearchResults(data.users);
            console.log(searchResults);
        } catch (error) {
            setError('Failed to search users');
        }
    };

    return (
        <UserContext.Provider value={{ friendSelect, setFriendSelect, user, error, friends, loginUser, registerUser, loading, googleSignIn, fetchUserDetails, request, sendFriendRequest, searchUsers, searchResults, acceptFriendRequest }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
