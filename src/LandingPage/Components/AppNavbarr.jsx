import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function AppNavbar() {
    return (
        <Navbar className="app-navbar">
        <Container className="navbar-inner">
            <div className="navbar-left">
            <PushPinRoundedIcon className="brand-icon" />
            <span className="brand-text">GeoStamp</span>
            </div>
            <div className="navbar-right">
            <Link className="admin-label" to="/admin">
                ADMIN
            </Link>
            <button
                className="view-events-btn"
            >
                VIEW EVENTS
            </button>
            </div>
        </Container>
        </Navbar>
    );
}

export default AppNavbar;
