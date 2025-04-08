import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import api from '../services/api';
import styled from 'styled-components';
import colors from '../styles/colors';
import { FaUserCog, FaEdit, FaSave, FaTimes, FaSignOutAlt } from 'react-icons/fa';

const ProfileContainer = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: ${colors.background};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid ${colors.accent};
`;

const ProfileTitle = styled.h1`
  color: ${colors.primary};
  font-size: 2.5rem;
  margin: 0;
  position: relative;
  display: inline-block;
`;

const ProfileSection = styled.div`
  margin-bottom: 2.5rem;
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  color: ${colors.primary};
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProfileField = styled.div`
  margin: 1.5rem 0;
`;

const Label = styled.label`
  display: block;
  color: ${colors.text};
  margin-bottom: 0.8rem;
  font-weight: 600;
  font-size: 1.1rem;
`;

const Value = styled.div`
  color: ${colors.text};
  padding: 0.8rem;
  background: ${colors.background};
  border-radius: 8px;
  font-size: 1.1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid ${colors.border};
  border-radius: 8px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${colors.accent};
    box-shadow: 0 0 0 3px rgba(61, 90, 128, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.variant === 'primary' ? colors.primary : 'transparent'};
  color: ${props => props.variant === 'primary' ? 'white' : colors.primary};
  border: ${props => props.variant === 'primary' ? 'none' : `2px solid ${colors.primary}`};
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.variant === 'primary' ? colors.accent : props.variant === 'logout' ? colors.error : 'transparent'};
    color: ${props => props.variant === 'logout' ? 'white' : 'inherit'};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: ${colors.error};
  background: rgba(230, 57, 70, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-weight: 500;
`;

const SuccessMessage = styled.div`
  color: ${colors.success};
  background: rgba(106, 153, 78, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-weight: 500;
`;

const AdminLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${colors.primary};
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.accent};
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');
    setLoading(true);

    try {
      await api.updateUserProfile(formData);
      setProfile(prev => ({
        ...prev,
        ...formData
      }));
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
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
    return (
      <ProfileContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading profile...
        </div>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>Profile</ProfileTitle>
        {profile?.admin && (
          <AdminLink to="/admin">
            <FaUserCog />
            Admin Dashboard
          </AdminLink>
        )}
      </ProfileHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <ProfileSection>
        <SectionTitle>Personal Information</SectionTitle>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <ProfileField>
              <Label>Name</Label>
              <Input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </ProfileField>
            <ProfileField>
              <Label>Phone</Label>
              <Input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </ProfileField>
            <ButtonGroup>
              <Button type="submit" variant="primary" disabled={loading}>
                <FaSave />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" onClick={() => setIsEditing(false)} variant="logout">
                <FaTimes />
                Cancel
              </Button>
            </ButtonGroup>
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
            <ButtonGroup>
              <Button onClick={() => setIsEditing(true)} variant="primary">
                <FaEdit />
                Edit Profile
              </Button>
              <Button onClick={handleLogout} variant="logout">
                <FaSignOutAlt />
                Logout
              </Button>
            </ButtonGroup>
          </>
        )}
      </ProfileSection>
    </ProfileContainer>
  );
};

export default Profile;