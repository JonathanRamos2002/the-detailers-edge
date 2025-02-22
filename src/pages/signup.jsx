import React, { useState } from 'react';
import styled from 'styled-components';
import { Eye, EyeOff } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import colors from '../styles/colors';

const Signup = () => { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'User', user.uid), {
          email: email,
          firstName: firstName,
          lastName: lastName
        });
      }
      navigate('/profile');
    } catch (error) {
      console.error(error);
      setErrorMessage('Registration failed. Please try again.');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };


  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'User', user.uid), {
          email: user.email,
          firstName: user.displayName.split(' ')[0],
          lastName: user.displayName.split(' ')[1]
        });
      }
      navigate('/profile');
    } catch (error) {
      console.error(error);
      setErrorMessage('Google auth failed. Please try again.');
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  }
  
  return (
    <SignupContainer>
      <SignupForm onSubmit={handleRegister}>
        <h1>Start Your Detailing Journey</h1>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <Input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <PasswordWrapper>
          <Input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <TogglePasswordButton type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff /> : <Eye />}
          </TogglePasswordButton>
        </PasswordWrapper>
        <Input 
          type="text" 
          placeholder="First Name" 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
        />
        <Input 
          type="text" 
          placeholder="Last Name" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
        />
        <Button type="submit">Register</Button>
        <LoginContainer>
          <p>Already have an account?</p>
          <LoginLink onClick={() => navigate('/login')}>Log In</LoginLink>
        </LoginContainer>
        <Separator>
          <Line />
          <span>or</span>
          <Line />
        </Separator>
        <GoogleButton onClick={handleGoogleSignup}>Sign in with Google</GoogleButton>
      </SignupForm>
    </SignupContainer>
  );
};

export default Signup;

const SignupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: ${colors.background};
`;

const SignupForm = styled.form`
  background: ${colors.white};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;

  h1 {
    margin-bottom: 1.5rem;
    color: ${colors.primary};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 2px solid ${colors.secondary};
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    border-color: ${colors.accent};
    outline: none;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${colors.secondary};

  &:hover {
    color: ${colors.accent};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${colors.accent};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${colors.primary};
  }
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;

  p {
    margin-right: 0.5rem;
    color: ${colors.secondary};
  }
`;

const LoginLink = styled.span`
  color: ${colors.accent};
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: ${colors.primary};
  }
`;

const Separator = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;

  span {
    margin: 0 1rem;
    color: ${colors.secondary};
  }
`;

const Line = styled.div`
  flex: 1;
  height: 1px;
  background: ${colors.secondary};
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${colors.google};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: ${colors.googleDark};
  }
`;

const ErrorMessage = styled.p`
  color: ${colors.error};
  margin-bottom: 1rem;
`;