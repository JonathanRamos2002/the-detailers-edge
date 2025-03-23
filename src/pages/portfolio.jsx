import React from "react";
import styled from "styled-components";
import colors from "../styles/colors";
import { getOptimizedImageUrl } from "../config/cloudinary";

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

const Portfolio = () => {
    const portfolioItems = [
        {
            id: 1,
            image: getOptimizedImageUrl('portfolio/car-detail-1', { width: 800, quality: 80 }),
            title: "Exterior Detailing",
            description: "Complete paint correction and ceramic coating"
        },
        {
            id: 2,
            image: getOptimizedImageUrl('portfolio/car-detail-2', { width: 800, quality: 80 }),
            title: "Interior Deep Clean",
            description: "Professional interior detailing"
        },
        {
            id: 3,
            image: getOptimizedImageUrl('portfolio/car-detail-3', { width: 800, quality: 80 }),
            title: "Paint Protection",
            description: "PPF installation and maintenance"
        },
        {
            id: 4,
            image: getOptimizedImageUrl('portfolio/car-detail-4', { width: 800, quality: 80 }),
            title: "Wheel Detailing",
            description: "Complete wheel and tire care"
        },
        {
            id: 5,
            image: getOptimizedImageUrl('portfolio/car-detail-5', { width: 800, quality: 80 }),
            title: "Headlight Restoration",
            description: "Professional headlight restoration service"
        },
        {
            id: 6,
            image: getOptimizedImageUrl('portfolio/car-detail-6', { width: 800, quality: 80 }),
            title: "Engine Bay Detailing",
            description: "Complete engine bay cleaning and dressing"
        },
        {
            id: 7,
            image: getOptimizedImageUrl('portfolio/car-detail-7', { width: 800, quality: 80 }),
            title: "Paint Correction",
            description: "Multi-stage paint correction process"
        },
        {
            id: 8,
            image: getOptimizedImageUrl('portfolio/car-detail-8', { width: 800, quality: 80 }),
            title: "Glass Treatment",
            description: "Professional glass cleaning and protection"
        },
        {
            id: 9,
            image: getOptimizedImageUrl('portfolio/car-detail-9', { width: 800, quality: 80 }),
            title: "Trim Restoration",
            description: "Plastic and rubber trim restoration"
        },
        {
            id: 10,
            image: getOptimizedImageUrl('portfolio/car-detail-10', { width: 800, quality: 80 }),
            title: "Full Detail Package",
            description: "Complete interior and exterior detailing"
        }
    ];

    return (
        <PortfolioContainer>
            <PortfolioHeader>
                <h1>Our Portfolio</h1>
                <p>
                    Explore our collection of automotive detailing projects. Each image represents our commitment to excellence in automotive care.
                </p>
            </PortfolioHeader>
            <PortfolioGrid>
                {portfolioItems.map((item) => (
                    <PortfolioItem key={item.id}>
                        <img src={item.image} alt={item.title} loading="lazy" />
                    </PortfolioItem>
                ))}
            </PortfolioGrid>
        </PortfolioContainer>
    );
};

export default Portfolio;