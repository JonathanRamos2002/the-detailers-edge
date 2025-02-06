import styled from 'styled-components';
import { NavLink as Link } from 'react-router-dom';
import colors from '../styles/colors';

export const Nav = styled.nav`
  background: ${colors.background};
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  font-size: 1.2rem;
`;

export const NavLogo = styled(Link)`
  color: ${colors.text};
  display: flex;
  align-items: center;
  text-decoration: none;
  height: 100%;
  cursor: pointer;
  margin-right: auto;

  img {
    height: 50px;
  }
`;

export const NavLink = styled(Link)`
  color: ${colors.text};
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: ${colors.accent};
  }
`;

export const NavMenu = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;  /* Makes the menu take up available space */
  gap: 2rem; /* Space between links */
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem; /* Adds space between the buttons */
  margin-left: auto; /* Pushes buttons to the right */
`;

export const NavButton = styled(Link)`
  background: ${colors.accent};
  color: ${colors.background};
  padding: 0.5rem 1.5rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: darken(${colors.accent}, 10%);
  }
`;

export const CircleButton = styled(Link)`
  background: ${colors.accent};
  color: ${colors.background};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  text-decoration: none;
  font-size: 1.2rem;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: darken(${colors.accent}, 10%);
  }
`;