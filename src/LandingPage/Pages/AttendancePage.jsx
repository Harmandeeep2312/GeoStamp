import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../Supabase/supabase-client";

import EventSummaryCard from "../Components/EventSummaryCard";
import GeoFenceCard from "../Components/GeofenceCard";
import AttendanceActionCard from "../Components/AttendanceActionCard";
import DeviceInfo from "../Components/DeviceInfo";
import "../styles/AttendancePage.css";

function AttendancePage() {
    const { eventId } = useParams();

    const [event, setEvent] = useState(null);
    const [attendanceMarked, setAttendanceMarked] = useState(false);
    const [loading, setLoading] = useState(true);

    const deviceId = (() => {
        const existing = localStorage.getItem("device_id");
        if (existing) return existing;

        // Prefer secure random UUID when available, otherwise fallback to a stable generated id
        let id;
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        try {
            id = crypto.randomUUID();
        } catch (e) {
            id = null;
        }
        }

        if (!id) {
        // fallback id: timestamp + random
        id = `dm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;
        }

        localStorage.setItem("device_id", id);
        return id;
    })();

    useEffect(() => {
        fetchEventAndStatus();
    }, [eventId]);

    const fetchEventAndStatus = async () => {
        try {
        // 1️⃣ Fetch event
        const { data: eventData, error } = await supabase
            .from("events")
            .select("*")
            .eq("id", eventId)
            .single();

        if (error || !eventData) {
            console.error("Error fetching event:", error);
            setLoading(false);
            return;
        }

        setEvent(eventData);

        // 2️⃣ Check if attendance already marked
        const { data: attendance, error: attendanceError } = await supabase
            .from("attendance")
            .select("id")
            .eq("event_id", eventId)
            .eq("device_id", deviceId)
            .maybeSingle();

        if (attendanceError) console.error("Error checking attendance:", attendanceError);

        setAttendanceMarked(!!attendance);
        setLoading(false);
        } catch (e) {
        console.error("Unexpected error in fetchEventAndStatus:", e);
        setLoading(false);
        }
    };

    const handleMarkAttendance = async () => {
        const { error } = await supabase.from("attendance").insert({
        event_id: event.id,
        device_id: deviceId,
        });

        if (error) {
        alert("Attendance already marked");
        return;
        }

        setAttendanceMarked(true);
    };

    if (loading) return <p className="loading-text">Loading attendance...</p>;
    if (!event)
    return (
        <div className="error-text card" style={{ maxWidth: 420 }}>
        <h3>Invalid or expired event</h3>
        <p>If you scanned a QR, the event ID <code>{eventId}</code> may be incorrect or expired.</p>
        <button className="secondary-btn" onClick={() => (window.location.href = "/")}>View Events</button>
        </div>
    );

    // Helper: parse ISO timestamps and assume UTC when timezone is missing
    const parseISODate = (s) => {
        if (!s) return null;
        const hasTZ = /Z|[+-]\d{2}(:\d{2})?/.test(s);
        return new Date(hasTZ ? s : s + "Z");
    };

    const startDate = parseISODate(event.start_time);
    const endDate = parseISODate(event.end_time);
    const now = new Date();
    const isLive = startDate && endDate && now >= startDate && now <= endDate;

    const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "local";

    return (
        <div className="attendance-page">
        <EventSummaryCard event={event} isLive={isLive} userTZ={userTZ} />

        <div className="attendance-main">
            <GeoFenceCard event={event} />

            <AttendanceActionCard
            attendanceMarked={attendanceMarked}
            isLive={isLive}
            onMark={handleMarkAttendance}
            onViewEvents={() => (window.location.href = "/")}
            />
        </div>

        <DeviceInfo deviceId={deviceId} />
        </div>
    );
}

export default AttendancePage;
