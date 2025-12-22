import { useEffect, useState } from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,} from "@mui/material";
import { supabase } from "../../Supabase/supabase-client";

function UpdateEventPopUp({ open, onClose, event, onUpdate }) {
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        if (!event) return;

        const start = new Date(event.startTime);
        const end = new Date(event.endTime);

        setFormData({
        name: event.name || "",
        venue: event.venue || "",
        description: event.description || "",
        startDate: start.toISOString().slice(0, 10),
        startTime: start.toTimeString().slice(0, 5),
        endDate: end.toISOString().slice(0, 10),
        endTime: end.toTimeString().slice(0, 5),
        latitude: event.latitude || "",
        longitude: event.longitude || "",
        radius: event.radius || 100,
        });
    }, [event]);

    if (!formData) return null;

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
        }

        navigator.geolocation.getCurrentPosition(
        (pos) => {
            setFormData((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            }));
        },
        () => alert("Location access denied")
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const startTime = new Date(
        `${formData.startDate}T${formData.startTime}`
        ).toISOString();

        const endTime = new Date(
        `${formData.endDate}T${formData.endTime}`
        ).toISOString();

        const { error } = await supabase.from("events").update({
            name: formData.name,
            venue: formData.venue,
            description: formData.description,
            startTime,
            endTime,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
            radius: Number(formData.radius),
        }).eq("id", event.id);

        if (!error) {
        onUpdate?.();
        onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Update Event</DialogTitle>

        <DialogContent>
            <form id="update-event-form" onSubmit={handleSubmit}>
            <label>Event Name</label>
            <input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
            />

            <label>Venue</label>
            <input
                value={formData.venue}
                onChange={(e) => handleChange("venue", e.target.value)}
                required
            />

            <label>Description</label>
            <input
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
            />

            <label>Start Date & Time</label>
            <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                required
            />
            <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                required
            />

            <label>End Date & Time</label>
            <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                required
            />
            <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                required
            />

            <label>Geofence</label>
            <button type="button" onClick={getCurrentLocation}>
                USE CURRENT LOCATION
            </button>

            <label>Latitude</label>
            <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => handleChange("latitude", e.target.value)}
                required
            />

            <label>Longitude</label>
            <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => handleChange("longitude", e.target.value)}
                required
            />

            <label>Radius (meters)</label>
            <input
                type="number"
                value={formData.radius}
                onChange={(e) => handleChange("radius", e.target.value)}
                required
            />
            </form>
        </DialogContent>

        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" form="update-event-form" variant="contained">
            Update Event
            </Button>
        </DialogActions>
        </Dialog>
    );
}

export default UpdateEventPopUp;
