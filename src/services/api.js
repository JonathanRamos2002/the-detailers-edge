import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getAuthToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return user.getIdToken();
  }
  return null;
};

const api = {
  // Authentication endpoints
  async logout() {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout');
    }
  },

  async signup(email, password, displayName, phoneNumber) {
    try {
      //console.log('Starting signup:', { email, displayName, phoneNumber });
      
      // Use Firebase Auth for initial authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      //console.log('Firebase Auth user created:', userCredential.user.uid);
      
      const token = await userCredential.user.getIdToken(true);
      console.log('Got Firebase token');

      //console.log('Sending profile request to backend');
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          displayName,
          phoneNumber
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error response:', errorData);
        throw new Error(errorData.details || 'Failed to create user profile');
      }

      const data = await response.json();
      console.log('Profile created successfully:', data);
      return data;
    } catch (error) {
      console.error('Signup error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      throw new Error(error.message || 'Signup failed');
    }
  },

  async login(email, password) {
    try {
      // Use Firebase Auth for initial authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(true);

      // Get user profile from our backend
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get user profile');
      }

      return response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  },

  async googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      // Use Firebase Auth for Google authentication
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken(true);

      // Get user profile from our backend
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error response:', errorData);
        throw new Error(errorData.error || 'Failed to get user profile');
      }

      const data = await response.json();
      console.log('Profile data:', data);
      return data;
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw new Error(error.message || 'Google Sign-In failed');
    }
  },

  async getUserProfile() {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  async updateUserProfile(data) {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update profile error:', errorData);
        throw new Error(errorData.details || 'Failed to update profile');
      }

      const result = await response.json();
      console.log('Profile updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  }
};

export default api;