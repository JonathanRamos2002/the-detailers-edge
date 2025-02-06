import React from "react";
import {Nav, NavLogo, NavLink, NavMenu, ButtonWrapper, NavButton, CircleButton} from "./NavbarElements";
import detailersEdgeLogo from "../assets/detailers_edge.jpg";

const Navbar = () => {
    return (
        <>
            <Nav>
                <NavLogo to="/" activeStyle>
                    <img src={detailersEdgeLogo} alt="Detailers Edge" />
                </NavLogo>

                <NavMenu>
                    <NavLink to="/services" activeStyle>
                        Services
                    </NavLink>
                    <NavLink to="/portfolio" activeStyle>
                        Portfolio
                    </NavLink>
                    <NavLink to="/testimonials" activeStyle>
                        Testimonials
                    </NavLink>
                    <NavLink to="/contact" activeStyle>
                        Contact
                    </NavLink>
                </NavMenu>

                <ButtonWrapper>
                    <NavButton to="/booking">
                        Book Now
                    </NavButton>
                    <CircleButton to="/sign-up">
                        ?
                    </CircleButton>
                </ButtonWrapper>
            </Nav>
        </>
    );
};

export default Navbar;
