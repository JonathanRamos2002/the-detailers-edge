import React, { useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom"
import sampleImage from "../assets/hero.jpg";
import colors from "../styles/colors"; 

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background: ${colors.background}; 
`;

const ContentSection = styled.div`
    display: flex;
    align-items: center;
    max-width: 1200px;
    width: 100%;
    gap: 2rem;

    @media screen and (max-width: 830px) {
        flex-direction: column;
        text-align: center;
    }
`;

const ImageWrapper = styled.div`
    flex: 1;
    
    img {
        width: 100%;
        max-width: 500px;
        border-radius: 12px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    }
`;

const TextWrapper = styled.div`
    flex: 1;
    padding: 1rem;

    h2 {
        font-size: 2rem;
        color: ${colors.primary};
    }

    p {
        font-size: 1.1rem;
        color: ${colors.text};
        margin: 1rem 0;
    }

    button {
        padding: 0.8rem 1.5rem;
        background: ${colors.secondary};
        color: ${colors.background};
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: 0.3s ease-in-out;

        &:hover {
            background: ${colors.primary};
            transform: scale(1.05);
        }
    }
`;

const StyledLink = styled(Link)`
    display: inline-block;
    padding: 0.8rem 1.5rem;
    background: ${colors.secondary};
    color: ${colors.background};
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    text-decoration: none;
    text-align: center;
    transition: 0.3s ease-in-out;

    &:hover {
        background: ${colors.primary};
        transform: scale(1.05);
    }
`;

const InstagramSection = styled.div`
    padding: 2rem;
    background: ${colors.background};
    margin-top: -2rem;
`;

const InstagramTitle = styled.h2`
    text-align: center;
    color: ${colors.primary};
    font-size: 2rem;
    margin-bottom: 1.5rem;
`;

const InstagramGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
`;

const InstagramEmbed = styled.div`
    background: ${colors.background};
    border-radius: 8px;
    box-shadow: 0 2px 8px ${colors.secondary}20;
    overflow: hidden;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px ${colors.secondary}30;
    }

    iframe {
        width: 100%;
        min-height: 400px;
        border: none;
    }
`;

const Home = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '//www.instagram.com/embed.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <>
            <Container>
                <ContentSection>
                    <ImageWrapper>
                        <img src={sampleImage} alt="Showcase" />
                    </ImageWrapper>
                    <TextWrapper>
                        <h2>Welcome to The Detailers Edge</h2>
                        <p>
                            Experience premium detailing services tailored to perfection. 
                            Our team ensures the highest quality care for your vehicle, 
                            leaving it looking flawless inside and out.
                        </p>
                        <StyledLink to="/booking">Book Now</StyledLink>
                    </TextWrapper>
                </ContentSection>
            </Container>

            <InstagramSection>
                <InstagramTitle>Check out our Instagram Page!</InstagramTitle>
                <InstagramGrid>
                    <InstagramEmbed>
                        <blockquote 
                            className="instagram-media" 
                            data-instgrm-captioned 
                            data-instgrm-permalink="https://www.instagram.com/reel/C4A3glGRg5H/?utm_source=ig_embed&amp;utm_campaign=loading" 
                            data-instgrm-version="14"
                        ></blockquote>
                    </InstagramEmbed>
                    <InstagramEmbed>
                        <blockquote 
                            className="instagram-media" 
                            data-instgrm-captioned 
                            data-instgrm-permalink="https://www.instagram.com/p/C302Tuwu63Q/?utm_source=ig_embed&amp;utm_campaign=loading" 
                            data-instgrm-version="14"
                        ></blockquote>
                    </InstagramEmbed>
                    <InstagramEmbed>
                        <blockquote 
                            className="instagram-media" 
                            data-instgrm-captioned 
                            data-instgrm-permalink="https://www.instagram.com/p/C3iZLe-ucWZ/?utm_source=ig_embed&amp;utm_campaign=loading" 
                            data-instgrm-version="14"
                        ></blockquote>
                    </InstagramEmbed>
                </InstagramGrid>
            </InstagramSection>
        </>
    );
};

export default Home;