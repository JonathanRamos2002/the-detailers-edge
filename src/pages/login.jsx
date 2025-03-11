import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import styled from 'styled-components';
import colors from '../styles/colors';
import api from '../services/api';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: ${colors.background};
`;

const LoginForm = styled.form`
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

const SignupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;

  p {
    margin-right: 0.5rem;
    color: ${colors.secondary};
  }
`;

const SignupLink = styled.span`
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

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { email, password } = formData;
      
      // Validate input
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      // Attempt to login
      await api.login(email, password);
      navigate('/profile');
    } catch (error) {
      setError(error.message || 'Failed to login. Please try again.');
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
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <h1>Welcome Back</h1>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input 
          type="email" 
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
        <SignupContainer>
          <p>Don't have an account?</p>
          <SignupLink onClick={() => navigate('/sign-up')}>Sign Up</SignupLink>
        </SignupContainer>
        <Separator>
          <Line />
          <span>or</span>
          <Line />
        </Separator>
        <GoogleButton type="button" onClick={handleGoogleSignIn} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </GoogleButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;