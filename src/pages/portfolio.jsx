import React, { useState, useEffect } from "react";
import styled from "styled-components";
import colors from "../styles/colors";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import Footer from "../components/Footer";

const PortfolioContainer = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    padding: 0;
    background: ${colors.background};
`;

const PortfolioHeader = styled.div`
    text-align: center;
    margin-bottom: 2rem;
    padding: 2rem 1rem;

    h1 {
        color: ${colors.primary};
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    p {
        color: ${colors.text};
        font-size: 1.1rem;
        max-width: 600px;
        margin: 0 auto;
    }
`;

const PortfolioGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
    padding: 0;
`;

const PortfolioItem = styled.div`
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;

    &:hover {
        transform: translateY(-5px);
    }

    img {
        width: 100%;
        height: 500px;
        object-fit: cover;
        display: block;
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
`;

const ErrorMessage = styled.div`
    color: ${colors.error};
    text-align: center;
    padding: 2rem;
    font-size: 1.1rem;
`;

const Portfolio = () => {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPortfolioImages();
    }, []);

    const fetchPortfolioImages = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/portfolio`);
            setImages(response.data || []);
        } catch (error) {
            console.error('Error fetching portfolio images:', error);
            setError('Failed to load portfolio images. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <PortfolioContainer>
                <LoadingContainer>
                    <p>Loading portfolio images...</p>
                </LoadingContainer>
            </PortfolioContainer>
        );
    }

    if (error) {
        return (
            <PortfolioContainer>
                <ErrorMessage>{error}</ErrorMessage>
            </PortfolioContainer>
        );
    }

    return (
        <>
        <PortfolioContainer>
            <PortfolioHeader>
                <h1>Our Portfolio</h1>
                <p>Take a look at some of our recent work and see the difference our detailing services can make.</p>
            </PortfolioHeader>
            <PortfolioGrid>
                {images.map((image) => (
                    <PortfolioItem key={image.id}>
                        <img 
                            src={image.url} 
                            alt={image.title} 
                            loading="lazy"
                        />
                    </PortfolioItem>
                ))}
            </PortfolioGrid>
        </PortfolioContainer>
        <Footer />  
        </>
    );
};

export default Portfolio;