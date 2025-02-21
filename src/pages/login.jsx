import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      console.log("USER LOGGED IN!");
      navigate('/profile');
    } catch (error) {
      console.log("USER NOT LOGGED IN!")
      console.error(error);
    }
  };

  

  return (
    <div>
        <h1>
            Login!
        </h1>
        
        <input placeholder='email' onChange={(e) => setEmail(e.target.value)}></input>
        <input placeholder='password' onChange={(e) => setPassword(e.target.value)}></input>
        <button onClick={handleLogin}>Log In</button>

    </div>
  );
};

export default Login;