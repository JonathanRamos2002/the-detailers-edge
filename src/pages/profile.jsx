import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import api from '../services/api';
import styled from 'styled-components';
import colors from '../styles/colors';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: ${colors.background};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.h1`
  color: ${colors.primary};
  margin-bottom: 2rem;
`;

const ProfileSection = styled.div`
  margin-bottom: 2rem;
`;

const ProfileField = styled.div`
  margin: 1rem 0;
  
  label {
    display: block;
    color: ${colors.text};
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid ${colors.border};
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: ${colors.primary};
    }
  }
`;

const Button = styled.button`
  background: ${colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: ${colors.secondary};
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin: 1rem 0;
`;

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    phoneNumber: ''
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const profileData = await api.getUserProfile();
        setProfile(profileData);
        setFormData({
          displayName: profileData.displayName || '',
          phoneNumber: profileData.phoneNumber || ''
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedProfile = await api.updateUserProfile(formData);
      setProfile(updatedProfile);
      setEditMode(false);
      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ProfileContainer>Loading profile...</ProfileContainer>;
  }

  if (error) {
    return <ProfileContainer>
      <ErrorMessage>{error}</ErrorMessage>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </ProfileContainer>;
  }

  return (
    <ProfileContainer>
      <ProfileHeader>My Profile</ProfileHeader>
      
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <ProfileSection>
            <ProfileField>
              <label>Email</label>
              <input type="email" value={profile.email} disabled />
            </ProfileField>
            
            <ProfileField>
              <label>Display Name</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            </ProfileField>
            
            <ProfileField>
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </ProfileField>
          </ProfileSection>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button type="button" onClick={() => setEditMode(false)} style={{ marginLeft: '1rem' }}>
            Cancel
          </Button>
        </form>
      ) : (
        <>
          <ProfileSection>
            <ProfileField>
              <label>Email</label>
              <div>{profile.email}</div>
            </ProfileField>
            
            <ProfileField>
              <label>Display Name</label>
              <div>{profile.displayName || 'Not set'}</div>
            </ProfileField>
            
            <ProfileField>
              <label>Phone Number</label>
              <div>{profile.phoneNumber || 'Not set'}</div>
            </ProfileField>
          </ProfileSection>
          
          <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
        </>
      )}
    </ProfileContainer>
  );
};

export default Profile;