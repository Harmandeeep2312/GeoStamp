import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { GeoFenceVisualizer } from "./GeoFenceVisualizer";
import { supabase } from "../../Supabase/supabase-client";
import UpdateEventPopUp from "./UpdateEventPopUp";
import AttendanceTable from "./AttendanceTable";
import AttendanceShareSection from "./AttendanceShareSection";
import ParticipantsCSVManager from "./ParticipantsCSVManager";

import "../styles/EventDetails.css";

function EventDetailsPopUp({ open, event, onClose, onDelete }) {
    const [editOpen, setEditOpen] = useState(false);
    const [attendance, setAttendance] = useState([]);
    const [csvName, setCsvName] = useState(null);
    const [csvOpen, setCsvOpen] = useState(false);

    useEffect(() => {
        if (!open || !event) return;

        const fetchAttendance = async () => {
        const { data } = await supabase
            .from("attendance")
            .select(
            `
            id,
            created_at,
            event_participants (
                name,
                email,
                roll_no
            )
            `
            )
            .eq("event_id", event.id)
            .order("created_at", { ascending: true });

        setAttendance(data || []);
        };

        fetchAttendance();
    }, [open, event]);

    useEffect(() => {
        if (!open || !event) return;

        const fetchCSVInfo = async () => {
        const { data } = await supabase
            .from("event_participants")
            .select("source_file")
            .eq("event_id", event.id)
            .limit(1)
            .maybeSingle();

        setCsvName(data?.source_file || null);
        };

        fetchCSVInfo();
    }, [open, event]);

    if (!event) return null;

    const start = new Date(event.startTime);
    const end = new Date(event.endTime);

    const handleDelete = async () => {
        const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id);

        if (!error) {
        onDelete(event.id);
        onClose();
        }
    };

    const handleCSVUpload = async (rows, filename) => {
        await supabase
        .from("event_participants")
        .delete()
        .eq("event_id", event.id);

        const payload = rows.map((r) => ({
        event_id: event.id,
        name: r.name,
        email: r.email,
        roll_no: r.roll_no,
        source_file: filename,
        }));

        await supabase.from("event_participants").insert(payload);

        setCsvName(filename);
        setCsvOpen(false);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontSize: 24, fontWeight: 700 }}>
            {event.name}
            <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 12, top: 12 }}
            >
            <CloseIcon />
            </IconButton>
        </DialogTitle>

        <DialogContent>
            <div className="event-details-layout">
            <div className="event-info">
                <p>📍 {event.venue}</p>
                <p>📅 {start.toLocaleDateString()} → {end.toLocaleDateString()}</p>
                <p>
                ⏰{" "}
                {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
                –{" "}
                {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>

                <div className="geofence-details">
                <h4>Geofence</h4>
                <p>Latitude: {event.latitude}</p>
                <p>Longitude: {event.longitude}</p>
                <p>Radius: {event.radius} m</p>
                </div>
            </div>

            <div className="geofence-visual">
                <GeoFenceVisualizer />
            </div>
            </div>

            <hr />

            <AttendanceShareSection eventId={event.id} />

            <div style={{ marginTop: 16 }}>
            {csvName ? (
                <>
                <p className="muted">CSV Uploaded: {csvName}</p>
                <Button
                    variant="outlined"
                    onClick={() => setCsvOpen(true)}
                >
                    Edit / Replace CSV
                </Button>
                </>
            ) : (
                <Button
                variant="contained"
                onClick={() => setCsvOpen(true)}
                >
                Add Participants (CSV)
                </Button>
            )}
            </div>

            <ParticipantsCSVManager
            open={csvOpen}
            csvInfo={csvName}
            onClose={() => setCsvOpen(false)}
            onUpload={handleCSVUpload}
            />

            <hr />

            <AttendanceTable attendance={attendance} />
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
            <Button color="error" variant="contained" onClick={handleDelete}>
            DELETE EVENT
            </Button>
            <Button
            color="primary"
            variant="contained"
            onClick={() => setEditOpen(true)}
            >
            EDIT EVENT
            </Button>
        </DialogActions>

        <UpdateEventPopUp
            open={editOpen}
            event={event}
            onClose={() => setEditOpen(false)}
        />
        </Dialog>
    );
}

export default EventDetailsPopUp;
