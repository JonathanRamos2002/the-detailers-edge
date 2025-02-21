import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";
import { darken } from "polished";
import colors from "../styles/colors";

export const Nav = styled.nav`
  background: ${colors.background};
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  font-size: 1.2rem;
  position: fixed; 
  width: 95%;
  top: 0; /* Stick to the top */
  z-index: ${({ isOpen }) => (isOpen ? "1000" : "998")}; /* Ensure it stays on top of other elements */
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
  color: ${colors.primary}; 
  text-decoration: none;
  padding: 0.5rem 1rem;
  position: relative;
  font-weight: 500; /* Slightly thinner than NavButton */
  transition: color 0.3s ease-in-out;

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 3px;
    bottom: -3px;
    left: 0;
    background: ${colors.secondary}; 
    transform: scaleX(0);
    transition: transform 0.3s ease-in-out;
  }

  &:hover::after {
    transform: scaleX(1);
  }

  &:hover {
    color: ${colors.secondary}; 
  }
`;

export const NavMenu = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
  gap: 2rem;

  @media screen and (max-width: 830px) {
    flex-direction: column;
    position: absolute;
    top: 80px;
    left: 0;
    width: 100%;
    background: ${colors.background};
    text-align: center;
    padding: 20px 0;
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;

  @media screen and (max-width: 830px) {
    display: none;  /* Hide buttons on mobile */
  }
`;


export const NavButton = styled(Link)`
  background: transparent;
  color: ${colors.text}; /* Match text color */
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease-in-out;

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 3px;
    bottom: 0;
    left: 0;
    background: ${colors.secondary}; /* Accent color for the underline */
    transform: scaleX(0);
    transition: transform 0.3s ease-in-out;
  }

  &:hover::after {
    transform: scaleX(1); /* Expand underline on hover */
  }

  &:hover {
    color: ${colors.secondary}; /* Accent color text on hover */
  }
`;



export const CircleButton = styled(Link)`
  background: ${colors.primary};
  color: ${colors.background};
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  text-decoration: none;
  font-size: 1.2rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow */
  transition: all 0.3s ease-in-out;

  &:hover {
    background: ${colors.secondary}; /* Swap colors on hover */
    color: ${colors.background};
    transform: scale(1.1); /* Slight scale effect */
  }
`;

/* Mobile Menu Icon */
export const MenuIcon = styled.div`
  display: none; /* Hidden by default */

  @media screen and (max-width: 830px) {
    display: block;
    position: absolute;
    right: 20px;
    font-size: 1.8rem;
    cursor: pointer;
    color: ${colors.text};
  }
`;

export const SideMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0; /* Position it on the right side */
  height: 100%;
  width: 250px;
  background: rgba(255, 255, 255, 0.1); /* Semi-transparent white background */
  backdrop-filter: blur(50px); /* Apply blur to the content behind */
  box-shadow: -2px 0px 15px rgba(0, 0, 0, 0.2); /* Soft shadow for the sides */
  transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(100%)'}; /* Slide in from the right */
  transition: transform 0.3s ease-in-out;
  z-index: 999;
`;

export const SideMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4rem 2rem 2rem 2rem;
  gap: 2rem;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.text};
  font-size: 2rem;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;

  &:hover {
    color: ${colors.secondary};
  }
`;
