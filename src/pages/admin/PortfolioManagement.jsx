import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrash, FaEdit, FaUpload, FaSpinner } from 'react-icons/fa';
import colors from '../../styles/colors';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../config/api';

const Container = styled.div`
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
`;

const Title = styled.h1`
    color: ${colors.primary};
    font-size: 2rem;
`;

const UploadSection = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
`;

const UploadButton = styled.label`
    display: inline-block;
    padding: 0.8rem 1.5rem;
    background: ${colors.secondary};
    color: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-right: 1rem;

    &:hover {
        background: ${colors.primary};
    }

    input {
        display: none;
    }
`;

const PreviewImage = styled.img`
    max-width: 200px;
    max-height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-top: 1rem;
`;

const SubmitButton = styled.button`
    padding: 0.8rem 1.5rem;
    background: ${colors.primary};
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: ${colors.secondary};
    }

    &:disabled {
        background: ${colors.text}50;
        cursor: not-allowed;
    }
`;

const ImageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
`;

const ImageCard = styled.div`
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Image = styled.img`
    width: 100%;
    height: 300px;
    object-fit: cover;
`;

const ImageActions = styled.div`
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    gap: 0.5rem;
`;

const ActionButton = styled.button`
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(0, 0, 0, 0.8);
    }
`;

const LoadingSpinner = styled(FaSpinner)`
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;

const ErrorMessage = styled.div`
    color: red;
    margin-top: 1rem;
`;

const SuccessMessage = styled.div`
    color: green;
    margin-top: 1rem;
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
`;

const PortfolioManagement = () => {
    const { currentUser } = useAuth();
    const [images, setImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchPortfolioImages();
    }, []);

    const fetchPortfolioImages = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/portfolio`, {
                headers: {
                    Authorization: `Bearer ${await currentUser.getIdToken()}`
                }
            });
            setImages(response.data || []);
        } catch (error) {
            console.error('Error fetching portfolio images:', error);
            setError('Failed to fetch portfolio images');
        } finally {
            setIsInitialLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select an image to upload');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post(`${API_BASE_URL}/portfolio/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${await currentUser.getIdToken()}`
                }
            });

            setSuccessMessage('Image uploaded successfully');
            setSelectedFile(null);
            setPreviewUrl('');
            fetchPortfolioImages();
        } catch (error) {
            console.error('Error uploading image:', error);
            setError(error.response?.data?.message || 'Failed to upload image');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (imageId) => {
        if (!window.confirm('Are you sure you want to delete this image?')) {
            return;
        }

        try {
            // Remove 'portfolio/' prefix if it exists
            const cleanImageId = imageId.replace('portfolio/', '');
            
            const response = await axios.delete(`${API_BASE_URL}/portfolio/${cleanImageId}`, {
                headers: {
                    Authorization: `Bearer ${await currentUser.getIdToken()}`
                }
            });
            
            if (response.data.message) {
                setSuccessMessage(response.data.message);
            }
            fetchPortfolioImages();
        } catch (error) {
            console.error('Error deleting image:', error);
            setError(error.response?.data?.message || 'Failed to delete image. Please try again.');
        }
    };

    return (
        <Container>
            <Header>
                <Title>Portfolio Management</Title>
            </Header>

            <UploadSection>
                <UploadButton>
                    <FaUpload /> Choose Image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                </UploadButton>
                <SubmitButton
                    onClick={handleUpload}
                    disabled={!selectedFile || isLoading}
                >
                    {isLoading ? <LoadingSpinner /> : 'Upload Image'}
                </SubmitButton>

                {previewUrl && (
                    <PreviewImage src={previewUrl} alt="Preview" />
                )}

                {error && <ErrorMessage>{error}</ErrorMessage>}
                {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
            </UploadSection>

            {isInitialLoading ? (
                <LoadingContainer>
                    <LoadingSpinner size={32} />
                </LoadingContainer>
            ) : (
                <ImageGrid>
                    {images && images.length > 0 ? (
                        images.map((image) => (
                            <ImageCard key={image.id}>
                                <Image 
                                    src={image.url} 
                                    alt={image.title} 
                                />
                                <ImageActions>
                                    <ActionButton onClick={() => handleDelete(image.id)}>
                                        <FaTrash />
                                    </ActionButton>
                                </ImageActions>
                            </ImageCard>
                        ))
                    ) : (
                        <p>No portfolio images found</p>
                    )}
                </ImageGrid>
            )}
        </Container>
    );
};

export default PortfolioManagement; 