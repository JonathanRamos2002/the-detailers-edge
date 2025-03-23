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

const ProfileHeader = styled.div`
  margin-bottom: 2rem;
`;

const ProfileTitle = styled.h1`
  color: ${colors.primary};
  margin: 0;
`;

const ProfileSection = styled.div`
  margin-bottom: 2rem;
`;

const ProfileField = styled.div`
  margin: 1rem 0;
`;

const Label = styled.label`
  display: block;
  color: ${colors.text};
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Value = styled.div`
  color: ${colors.text};
  padding: 0.5rem 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
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

const LogoutButton = styled(Button)`
  background: ${colors.error};
  margin-top: 1rem;

  &:hover {
    background: ${colors.errorDark};
  }
`;

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
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
        const data = await api.getUserProfile();
        setProfile(data);
        setFormData({
          displayName: data.displayName || '',
          phoneNumber: data.phoneNumber || ''
        });
      } catch (error) {
        setError('Failed to load profile');
        console.error('Profile error:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.updateUserProfile(formData);
      setProfile(prev => ({
        ...prev,
        ...formData
      }));
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile');
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      navigate('/login');
    } catch (error) {
      setError('Failed to logout');
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>Profile</ProfileTitle>
      </ProfileHeader>
      <ProfileSection>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <ProfileField>
              <Label>Name</Label>
              <Input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
              />
            </ProfileField>
            <ProfileField>
              <Label>Phone</Label>
              <Input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </ProfileField>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </form>
        ) : (
          <>
            <ProfileField>
              <Label>Name</Label>
              <Value>{profile?.displayName || 'Not set'}</Value>
            </ProfileField>
            <ProfileField>
              <Label>Email</Label>
              <Value>{profile?.email || 'Not set'}</Value>
            </ProfileField>
            <ProfileField>
              <Label>Phone</Label>
              <Value>{profile?.phoneNumber || 'Not set'}</Value>
            </ProfileField>
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          </>
        )}
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </ProfileSection>
    </ProfileContainer>
  );
};

export default Profile;