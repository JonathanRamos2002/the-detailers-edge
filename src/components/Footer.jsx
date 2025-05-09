import React from 'react';
import styled from 'styled-components';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import colors from '../styles/colors';

const FooterContainer = styled.footer`
  background-color: ${colors.primary};
  color: white;
  padding: 4rem 2rem 2rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #ffffff;
`;

const FooterLink = styled.a`
  color: #a0a0a0;
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: #ffffff;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialIcon = styled.a`
  color: #a0a0a0;
  font-size: 1.5rem;
  transition: color 0.2s;
  
  &:hover {
    color: #ffffff;
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 2rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid #333;
  text-align: center;
  color: #a0a0a0;
  font-size: 0.9rem;
`;

const Credits = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #a0a0a0;
  
  a {
    color: #a0a0a0;
    text-decoration: none;
    transition: color 0.2s;
    
    &:hover {
      color: #ffffff;
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>The Detailers Edge</FooterTitle>
          <p style={{ color: '#a0a0a0' }}>
            Professional auto detailing services that bring out the best in your vehicle.
          </p>
          <SocialLinks>
            <SocialIcon href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </SocialIcon>
            <SocialIcon href="https://www.instagram.com/thedetailersedgee/" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </SocialIcon>
            <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </SocialIcon>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Services</FooterTitle>
          <FooterLink href="/services">Full Detail</FooterLink>
          <FooterLink href="/services">Interior Detailing</FooterLink>
          <FooterLink href="/services">Paint Correction</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/services">Services</FooterLink>
          <FooterLink href="/portfolio">Portfolio</FooterLink>
          <FooterLink href="/testimonials">Testimonials</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Contact Info</FooterTitle>
          <p style={{ color: '#a0a0a0' }}>8860 Cherry Ln</p>
          <p style={{ color: '#a0a0a0' }}>Laurel, MD 20708</p>
          <p style={{ color: '#a0a0a0' }}>Phone: (240) 486-7427</p>
          <p style={{ color: '#a0a0a0' }}>Email: thedetailersedge135@gmail.com</p>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <p>&copy; {new Date().getFullYear()} The Detailers Edge. All rights reserved.</p>
        <Credits>
          <p>
            Website developed by{' '}
            <a href="https://github.com/JonathanRamos2002" target="_blank" rel="noopener noreferrer">Jonathan Ramos</a>
            {' '}and{' '}
            <a href="https://github.com/ayoposiolubamisaye" target="_blank" rel="noopener noreferrer">Ayoposi Olu-Bamisaye</a>
          </p>
        </Credits>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer; 