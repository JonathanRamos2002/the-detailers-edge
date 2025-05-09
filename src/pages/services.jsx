import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { IoCarSport } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import colors from '../styles/colors';
import Footer from '../components/Footer';

const ServicesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  background: ${colors.background};
`;

const ServicesHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;

  h1 {
    font-size: 2.5rem;
    color: ${colors.primary};
    margin-bottom: 1rem;
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background: ${colors.accent};
    }
  }

  p {
    font-size: 1.1rem;
    color: ${colors.text};
    max-width: 600px;
    margin: 2rem auto;
    line-height: 1.6;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  padding: 0 1rem;
`;

const ServiceCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  position: relative;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-10px);
    border-color: ${colors.accent};
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ServiceImage = styled.div`
  height: 250px;
  background: ${props => props.imageUrl ? `url(${props.imageUrl})` : '#f0f0f0'};
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  }
`;

const ServiceContent = styled.div`
  padding: 2rem;
  position: relative;
`;

const ServiceTitle = styled.h3`
  color: ${colors.primary};
  font-size: 1.8rem;
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 10px;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 50px;
    height: 3px;
    background: ${colors.accent};
  }
`;

const ServiceDescription = styled.p`
  color: ${colors.text};
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const ServiceFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;

  li {
    display: flex;
    align-items: center;
    margin-bottom: 0.8rem;
    color: ${colors.text};

    svg {
      color: ${colors.accent};
      margin-right: 10px;
      flex-shrink: 0;
    }
  }
`;

const ServicePrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${colors.primary};
  margin: 1.5rem 0;
`;

const BookNowButton = styled.button`
  background: ${colors.primary};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background: ${colors.accent};
    transform: translateY(-2px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.2rem;
  color: ${colors.text};
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: ${colors.error};
  padding: 2rem;
  font-size: 1.1rem;
`;

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/services`);
        setServices(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookNow = () => {
    navigate('/booking');
  };

  if (loading) {
    return <LoadingContainer>Loading services...</LoadingContainer>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <>
    <ServicesContainer>
      <ServicesHeader>
        <h1>Our Services</h1>
        <p>Choose from our range of professional detailing services to keep your vehicle looking its best.</p>
      </ServicesHeader>

      <ServicesGrid>
        {services.map((service) => (
          <ServiceCard key={service.id}>
            <ServiceImage imageUrl={service.image} />
            <ServiceContent>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
              <ServiceFeatures>
                {service.features.map((feature, index) => (
                  <li key={index}>
                    <IoCarSport />
                    {feature}
                  </li>
                ))}
              </ServiceFeatures>
              <ServicePrice>${service.price}</ServicePrice>
              <BookNowButton onClick={handleBookNow}>
                Book Now
                <FaArrowRight />
              </BookNowButton>
            </ServiceContent>
          </ServiceCard>
        ))}
      </ServicesGrid>
    </ServicesContainer>
    <Footer />
    </>
  );
};

export default Services;