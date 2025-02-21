import React, { useEffect, useState} from "react";
import { auth, db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userRef = doc(db, 'User', user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUser(userSnap.data());
                } else {
                    console.error('User not found');
                }
            }
        });
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            {user ? (
                <>
                    <h1>{user.firstName} {user.lastName}</h1>
                    <p>{user.email}</p>
                    <button onClick={handleLogout}>Log Out</button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;