import React, { useState } from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions, Button,IconButton,} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { supabase } from "../../Supabase/supabase-client";
import ParticipantsCSVSection from "./ParticipantsCsvSection";
import "../styles/EventsCreationPop.css";
import AttendanceSharePopUp from "./AttendanceSharePopUP";

function EventsCreationPopUp({ open, onClose, onCreated }) {
    const [formData, setFormData] = useState({
        name: "",
        venue: "",
        description: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        latitude: "",
        longitude: "",
        radius: 100,
    });

    const [participants, setParticipants] = useState([]);
    const [csvFileName, setCsvFileName] = useState(null);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [createdEventId, setCreatedEventId] = useState(null);

    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
        }

        navigator.geolocation.getCurrentPosition((pos) => {
        setFormData((prev) => ({
            ...prev,
            latitude: pos.coords.latitude.toFixed(6),
            longitude: pos.coords.longitude.toFixed(6),
        }));
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {
        data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
        alert("Not authenticated");
        return;
        }

        const startTime = new Date(
        `${formData.startDate}T${formData.startTime}`
        ).toISOString();

        const endTime = new Date(
        `${formData.endDate}T${formData.endTime}`
        ).toISOString();

        const { data: event, error } = await supabase
        .from("events")
        .insert({
            name: formData.name,
            venue: formData.venue,
            description: formData.description,
            startTime,
            endTime,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
            radius: Number(formData.radius),
            created_by: user.id,
        })
        .select()
        .single();

        if (error) {
        alert(error.message);
        return;
        }

        if (participants.length > 0) {
        const payload = participants.map((p) => ({
            event_id: event.id,
            name: p.name,
            email: p.email,
            roll_no: p.roll_no,
            source_file: csvFileName,
        }));

        await supabase.from("event_participants").insert(payload);
        }

        onCreated?.();

        setCreatedEventId(event.id);
        setShowSharePopup(true);
    };

    return (
        <>
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle className="dialog-title">
            Create New Event
            <IconButton onClick={onClose}>
                <CloseIcon />
            </IconButton>
            </DialogTitle>

            <DialogContent>
            <form className="event-form" onSubmit={handleSubmit}>
                <div className="two-col">
                <input
                    name="name"
                    placeholder="Event Name"
                    onChange={handleChange}
                    required
                />
                <input
                    name="venue"
                    placeholder="Venue Name"
                    onChange={handleChange}
                    required
                />
                </div>

                <input
                name="description"
                placeholder="Brief description of the event"
                onChange={handleChange}
                />

                <div className="two-col">
                <div className="time-group">
                    <input type="date" name="startDate" onChange={handleChange} required />
                    <input type="time" name="startTime" onChange={handleChange} required />
                </div>

                <div className="time-group">
                    <input type="date" name="endDate" onChange={handleChange} required />
                    <input type="time" name="endTime" onChange={handleChange} required />
                </div>
                </div>

                <div className="geo-header">
                <span>Geofence Coordinates</span>
                <button type="button" onClick={getCurrentLocation} className="geo-btn">
                    USE CURRENT LOCATION
                </button>
                </div>

                <div className="three-col">
                <input value={formData.latitude} placeholder="Latitude" readOnly />
                <input value={formData.longitude} placeholder="Longitude" readOnly />
                <input
                    name="radius"
                    type="number"
                    placeholder="Radius (meters)"
                    onChange={handleChange}
                />
                </div>

                <ParticipantsCSVSection
                onParticipantsLoaded={(rows, filename) => {
                    setParticipants(rows);
                    setCsvFileName(filename);
                }}
                />

                {participants.length > 0 && (
                <p className="success-text">
                    ✅ {participants.length} participants loaded
                </p>
                )}

                <DialogActions className="dialog-actions">
                <Button onClick={onClose} className="cancel-btn">
                    Cancel
                </Button>
                <Button type="submit" className="create-btn">
                    Create Event
                </Button>
                </DialogActions>
            </form>
            </DialogContent>
        </Dialog>

        <AttendanceSharePopUp
            open={showSharePopup}
            eventId={createdEventId}
            onClose={() => {
            setShowSharePopup(false);
            onClose();
            }}
        />
        </>
    );
}

export default EventsCreationPopUp;
