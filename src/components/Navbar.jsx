import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Nav, NavLogo, NavLink, NavMenu, ButtonWrapper, NavButton, CircleButton, MenuIcon, SideMenu, SideMenuWrapper, CloseButton } from "./NavbarElements";
import detailersEdgeLogo from "../assets/detailers_edge.jpg";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleSideMenu = () => setIsSideMenuOpen(!isSideMenuOpen);

    return (
        <>
            <Nav>
                <NavLogo to="/">
                    <img src={detailersEdgeLogo} alt="Detailers Edge" />
                </NavLogo>

                <NavMenu isOpen={isOpen}>
                    <NavLink to="/services">Services</NavLink>
                    <NavLink to="/portfolio">Portfolio</NavLink>
                    <NavLink to="/testimonials">Testimonials</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                </NavMenu>

                <ButtonWrapper>
                    <NavButton to="/booking">Book Now</NavButton>
                    <CircleButton to="/sign-up">?</CircleButton>
                </ButtonWrapper>

                {/* Mobile Menu Toggle */}
                <MenuIcon onClick={toggleSideMenu}>
                    {isSideMenuOpen ? <FaTimes /> : <FaBars />}
                </MenuIcon>
            </Nav>

            {/* Side Menu */}
            <SideMenu isOpen={isSideMenuOpen}>
                <CloseButton onClick={toggleSideMenu}>
                    <FaTimes />
                </CloseButton>
                <SideMenuWrapper>
                    <NavLink to="/services" activeStyle>Services</NavLink>
                    <NavLink to="/portfolio" activeStyle>Portfolio</NavLink>
                    <NavLink to="/testimonials" activeStyle>Testimonials</NavLink>
                    <NavLink to="/contact" activeStyle>Contact</NavLink>
                    <NavLink to="/booking" activeStyle>Book Now</NavLink>
                    <NavLink to="/sign-up" activeStyle>Sign Up</NavLink>
                </SideMenuWrapper>
            </SideMenu>
        </>
    );
};

export default Navbar;
