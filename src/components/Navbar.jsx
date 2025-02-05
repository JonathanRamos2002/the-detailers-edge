import React from "react";
import {Nav, NavLogo, NavLink, NavMenu} from "./NavbarElements";
import detailersEdgeLogo from "../assets/detailers_edge.jpg";

const Navbar = () => {
    return (
        <>
            <Nav>
                <NavLogo to="/" activeStyle>
                    <img src={detailersEdgeLogo} alt="Detailers Edge" />
                </NavLogo>
                <NavMenu>
                    <NavLink to="/about" activeStyle>
                        About
                    </NavLink>
                    <NavLink to="/contact" activeStyle>
                        Contact Us
                    </NavLink>
                    <NavLink to="/blogs" activeStyle>
                        Blogs
                    </NavLink>
                    <NavLink to="/sign-up" activeStyle>
                        Sign Up
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};

export default Navbar;
