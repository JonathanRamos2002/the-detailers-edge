import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaCar, FaImages, FaCalendarAlt, FaUserCog } from 'react-icons/fa';
import colors from '../../styles/colors';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  background: ${colors.background};
`;

const DashboardHeader = styled.div`
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

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
`;

const DashboardCard = styled(Link)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  text-decoration: none;
  color: ${colors.text};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-10px);
    border-color: ${colors.accent};
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
`;

const CardIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
  font-size: 2rem;
  transition: all 0.3s ease;

  ${DashboardCard}:hover & {
    background: ${colors.accent};
    transform: scale(1.1);
  }
`;

const CardTitle = styled.h3`
  color: ${colors.primary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  color: ${colors.text};
  line-height: 1.6;
`;

const Dashboard = () => {
  const adminCards = [
    {
      title: 'Services Management',
      description: 'Manage your service packages, including adding, editing, and removing services.',
      icon: <FaCar />,
      path: '/admin/services'
    },
    {
      title: 'Portfolio Management',
      description: 'Manage your portfolio images, upload new images, and organize your work.',
      icon: <FaImages />,
      path: '/admin/portfolio'
    },
    {
      title: 'Bookings Management',
      description: 'View and manage customer bookings, appointments, and schedules.',
      icon: <FaCalendarAlt />,
      path: '/admin/bookings'
    },
    {
      title: 'Profile Settings',
      description: 'Update your admin profile information and account settings.',
      icon: <FaUserCog />,
      path: '/profile'
    }
  ];

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Admin Dashboard</h1>
      </DashboardHeader>

      <DashboardGrid>
        {adminCards.map((card, index) => (
          <DashboardCard key={index} to={card.path}>
            <CardIcon>{card.icon}</CardIcon>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </DashboardCard>
        ))}
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default Dashboard; 