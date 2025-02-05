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

  img {
    height: 40px;
  }
`;

export const NavLink = styled(Link)`
  color: ${colors.text};
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;

  &.active {
    color: ${colors.accent};
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
`;
