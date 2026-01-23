import React, { useState } from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,IconButton,} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { supabase } from "../../Supabase/supabase-client";
import ParticipantsCSVSection from "./ParticipantsCsvSection";
import AttendanceSharePopUp from "./AttendanceSharePopUP";
import "../styles/EventsCreationPop.css";


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

    const handleChange = (e) =>
        setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
        setFormData((p) => ({
            ...p,
            latitude: pos.coords.latitude.toFixed(6),
            longitude: pos.coords.longitude.toFixed(6),
        }));
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data: auth } = await supabase.auth.getUser();
        if (!auth?.user) return alert("Not authenticated");

        const startTime = `${formData.startDate}T${formData.startTime}:00`;
        const endTime = `${formData.endDate}T${formData.endTime}:00`;


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
            created_by: auth.user.id,
        })
        .select()
        .single();

        if (error) return alert(error.message);

        // Insert participants (NO user_id here)
        if (participants.length > 0) {
        const payload = participants.map((p) => ({
            event_id: event.id,
            name: p.name,
            email: p.email,
            roll_no: p.roll_no,
            source_file: csvFileName,
        }));

        const { error } = await supabase
            .from("event_participants")
            .insert(payload);

        if (error) return alert(error.message);
        }

        onCreated?.();
        setParticipants([]);
        setCsvFileName(null);
        setCreatedEventId(event.id);
        setShowSharePopup(true);
    };

    return (
        <>
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontSize: 24, fontWeight: 700, color: "white" }}>
            Create New Event
            <IconButton onClick={onClose}>
                <CloseIcon className="icon" />
            </IconButton>
            </DialogTitle>

            <DialogContent>
            <form className="event-form" onSubmit={handleSubmit}>
                <div className="two-col">
                <input name="name" placeholder="Event Name" onChange={handleChange} required />
                <input name="venue" placeholder="Venue Name" onChange={handleChange} required />
                </div>

                <input
                name="description"
                placeholder="Brief description"
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
                <input value={formData.latitude} readOnly placeholder="Latitude" />
                <input value={formData.longitude} readOnly placeholder="Longitude" />
                <input name="radius" type="number" placeholder="Radius (m)" onChange={handleChange} />
                </div>
                {open && !createdEventId && (
                <ParticipantsCSVSection
                onParticipantsLoaded={(rows, filename) => {
                    setParticipants(rows);
                    setCsvFileName(filename);
                }}
                />
            )}
                {participants.length > 0 && (
                <p className="success-text">✅ {participants.length} participants loaded</p>
                )}

                <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit">Create Event</Button>
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
