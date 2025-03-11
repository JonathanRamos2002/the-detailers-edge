import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const API_URL = 'http://localhost:5001/api';

const getAuthToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return user.getIdToken();
  }
  return null;
};

const api = {
  // Authentication endpoints
  async login(email, password) {
    try {
      // Use Firebase Auth for initial authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

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
      const token = await result.user.getIdToken();

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
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

export default api;