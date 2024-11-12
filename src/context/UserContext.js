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
    const [friendSelect, setFriendSelect] = useState(null);
    const [mode, setmode]=useState("light");
    const [groupSelect, setGroupSelect] = useState(null);

    const url="https://chit-chat-api-lilac.vercel.app"

    // const url="http://localhost:5000"

    useEffect(() => {
        if (user) {
            fetchFriends(user._id);
            fetchRequest(user._id);
        }
    }, [user]);

    const clearError = () => setError(null);

    const loginUser = async (email, uid) => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/api/auth/login`, {
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
        } catch (error) {
            setError(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const registerUser = async (name, email, password, pic) => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/api/auth/createuser`, {
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
            const { displayName, email, photoURL, uid } = user;

            await registerUser(displayName, email, uid, photoURL);
            await loginUser(email, uid);
        } catch (error) {
            setError("Firebase Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchFriends = async (userId) => {
        try {
            const response = await fetch(`${url}/api/friend/${userId}`);
            const data = await response.json();
            setFriends(data);
        } catch (error) {
            setError('Failed to fetch friends');
        }
    };

    const fetchRequest = async (userId) => {
        try {
            const response = await fetch(`${url}/api/friend/requests/${userId}`);
            const data = await response.json();
            setRequest(data);
        } catch (error) {
            setError('Failed to fetch friend requests');
        }
    };

    const fetchUserDetails = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch(`${url}/api/auth/user`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch user details');
                }
                setUser(data.user);
            } catch (error) {
                console.error('Error fetching user details:', error.message);
                setError('Failed to fetch user details');
            }
        } else {
            setError('No token found');
        }
    };
    

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const sendFriendRequest = async (friendId) => {
        try {
            const response = await fetch(`${url}/api/friend/add`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
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
            const response = await fetch(`${url}/api/friend/accept`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: requestId }),
            });
            if (response.ok) {
                await fetchFriends(user._id);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [group, setGroup]=useState(false);

    const searchUsers = async (query) => {
        try {
            const response = await fetch(`${url}/api/auth/search?query=${query}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('token')
                }
            });
            const data = await response.json();
            setSearchResults(data.users);
        } catch (error) {
            setError('Failed to search users');
        }
    };

    const removeFriend = async (friendId) => {
        try {
            const response = await fetch(`${url}/api/friend/remove-friend/${friendId}/${user._id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    // 'authorization': localStorage.getItem('token'),
                },
            });
            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                throw new Error(data.error || 'Failed to remove friend');
            }
            setFriends((prevFriends) => prevFriends.filter(friend => friend._id !== friendId));
            alert('Friend removed successfully.');
        } catch (error) {
            setError(error.message || 'Failed to remove friend');
        }
    };

    return (
        <UserContext.Provider value={{
            clearError, friendSelect, setFriendSelect, user, error, friends, loginUser, registerUser, loading, googleSignIn,
            fetchUserDetails, request,url,mode,removeFriend, setmode, sendFriendRequest, searchUsers, searchResults, acceptFriendRequest, group, setGroup, groupSelect, setGroupSelect
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
