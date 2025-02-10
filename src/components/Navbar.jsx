import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Nav, NavLogo, NavLink, NavMenu, ButtonWrapper, NavButton, CircleButton, MenuIcon } from "./NavbarElements";
import detailersEdgeLogo from "../assets/detailers_edge.jpg";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Nav>
            <NavLogo to="/">
                <img src={detailersEdgeLogo} alt="Detailers Edge" />
            </NavLogo>


            <NavMenu className={isOpen ? "open" : ""}>
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
            <MenuIcon onClick={toggleMenu}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </MenuIcon>
        </Nav>
    );
};

export default Navbar;
