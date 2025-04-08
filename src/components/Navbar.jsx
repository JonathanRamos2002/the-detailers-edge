import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { Nav, NavLogo, NavLink, NavMenu, ButtonWrapper, NavButton, CircleButton, MenuIcon, SideMenu, SideMenuWrapper, CloseButton } from "./NavbarElements";
import detailersEdgeLogo from "../assets/detailers_edge.jpg";
import { auth } from "../firebase";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleSideMenu = () => setIsSideMenuOpen(!isSideMenuOpen);

    return (
        <>
            <Nav>
                <NavLogo to="/">
                    <img src={detailersEdgeLogo} alt="Detailers Edge" />
                </NavLogo>

                <NavMenu $isOpen={isOpen}>
                    <NavLink to="/services">Services</NavLink>
                    <NavLink to="/portfolio">Portfolio</NavLink>
                    <NavLink to="/testimonials">Testimonials</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                </NavMenu>

                <ButtonWrapper>
                    <NavButton to="/booking">Book Now</NavButton>
                    <CircleButton to={user ? "/profile" : "/login"}>
                        {user ? <FaUser /> : "?"}
                    </CircleButton>
                </ButtonWrapper>

                {/* Mobile Menu Toggle */}
                <MenuIcon onClick={toggleSideMenu}>
                    {isSideMenuOpen ? <FaTimes /> : <FaBars />}
                </MenuIcon>
            </Nav>

            {/* Side Menu */}
            <SideMenu $isOpen={isSideMenuOpen}>
                <CloseButton onClick={toggleSideMenu}>
                    <FaTimes />
                </CloseButton>
                <SideMenuWrapper>
                    <NavLink to="/services">Services</NavLink>
                    <NavLink to="/portfolio">Portfolio</NavLink>
                    <NavLink to="/testimonials">Testimonials</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                    <NavLink to="/booking">Book Now</NavLink>
                    {user ? (
                        <NavLink to="/profile">Profile</NavLink>
                    ) : (
                        <NavLink to="/login">Login</NavLink>
                    )}
                </SideMenuWrapper>
            </SideMenu>
        </>
    );
};

export default Navbar;
