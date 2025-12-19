import React from "react";
import "../styles/GeofenceVisualizer.css";

export function GeoFenceVisualizer() {
    return (
        <div className="geo-wrapper">
        <div className="geo-scan" />
        <div className="geo-ring outer" />
        <div className="geo-ring middle" />
        <div className="geo-ring inner" />
        <span className="tick top" />
        <span className="tick right" />
        <span className="tick bottom" />
        <span className="tick left" />
        <div className="geo-center" />
        </div>
    )
}
