import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import styled from 'styled-components';
import colors from '../styles/colors';
import api from '../services/api';

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

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
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

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
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

const ErrorMessage = styled.p`
  color: ${colors.error};
  margin-bottom: 1rem;
`;

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { displayName, email, phoneNumber, password, confirmPassword } = formData;
      
      // Validate input
      if (!displayName || !email || !phoneNumber || !password || !confirmPassword) {
        throw new Error('Please fill in all fields');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Attempt to signup
      await api.signup(email, password, displayName, phoneNumber);
      
      // If successful, redirect to profile page
      navigate('/profile');
    } catch (error) {
      setError(error.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await api.googleSignIn();
      navigate('/profile');
    } catch (error) {
      setError(error.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupContainer>
      <SignupForm onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input 
          type="text" 
          placeholder="Full Name"
          name="displayName"
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
        />
        <Input 
          type="email" 
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input 
          type="tel" 
          placeholder="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        />
        <PasswordWrapper>
          <Input 
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <TogglePasswordButton type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff /> : <Eye />}
          </TogglePasswordButton>
        </PasswordWrapper>
        <PasswordWrapper>
          <Input 
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          <TogglePasswordButton type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </TogglePasswordButton>
        </PasswordWrapper>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
        <LoginContainer>
          <p>Already have an account?</p>
          <LoginLink onClick={() => navigate('/login')}>Log In</LoginLink>
        </LoginContainer>
        <Separator>
          <Line />
          <span>or</span>
          <Line />
        </Separator>
        <GoogleButton type="button" onClick={handleGoogleSignIn} disabled={loading}>
          {loading ? 'Signing up...' : 'Sign up with Google'}
        </GoogleButton>
      </SignupForm>
    </SignupContainer>
  );
};

export default SignUp; 