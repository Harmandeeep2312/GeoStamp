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

    const deviceId =
        localStorage.getItem("device_id") ||
        (() => {
        const id = crypto.randomUUID();
        localStorage.setItem("device_id", id);
        return id;
        })();

    useEffect(() => {
        fetchEventAndStatus();
    }, [eventId]);

    const fetchEventAndStatus = async () => {
        // 1️⃣ Fetch event
        const { data: eventData, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

        if (error || !eventData) {
        setLoading(false);
        return;
        }

        setEvent(eventData);

        // 2️⃣ Check if attendance already marked
        const { data: attendance } = await supabase
        .from("attendance")
        .select("id")
        .eq("event_id", eventId)
        .eq("device_id", deviceId)
        .maybeSingle();

        setAttendanceMarked(!!attendance);
        setLoading(false);
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
    if (!event) return <p className="error-text">Invalid or expired event</p>;

    const isLive =
        new Date() >= new Date(event.start_time) &&
        new Date() <= new Date(event.end_time);

    return (
        <div className="attendance-page">
        <EventSummaryCard event={event} isLive={isLive} />

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
