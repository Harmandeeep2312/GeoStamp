import React, { useState } from "react";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import { GeoFenceVisualizer } from "./GeoFenceVisualizer";
import "../styles/HeroSection.css";
import AttendanceEntryModal from "./AttendanceEntryModel";
import { useNavigate } from "react-router-dom";

function HeroSection() {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);

    const handleOpen = () =>{
        setOpen(true);
    }
    const handleClose = () =>{
        setOpen(false);
    }
    return (
        <div className="Container hero-layout">
        <div className="HeroSection-text">
            <h1>Geofence-Based Attendance Validation</h1>
            <h3>Presence, Verified</h3>
            <p>
            Ensure real-world presence through secure geofencing.
            No proxies. No duplicates.
            </p>

            <div className="hero-actions">
            <button className="hero-btn primary" onClick={() => navigate("/auth?redirect=/admin")}>
                <ShieldRoundedIcon />
                Create Event
            </button>

            <button className="hero-btn secondary" onClick={handleOpen}>
                <PeopleOutlineRoundedIcon />
                Mark Attendance
            </button>
            <AttendanceEntryModal 
            open={open}
            onClose={handleClose}/>
            </div>
        </div>

        <div className="HeroSection-Visual">
            <GeoFenceVisualizer />
            <span className="geofence-status">GEOFENCE ACTIVE</span>
        </div>
        </div>
    );
}

export default HeroSection;
