import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../Supabase/supabase-client";

import EventSummaryCard from "../Components/EventSummaryCard";
import GeoFenceCard from "../Components/GeofenceCard";
import AttendanceActionCard from "../Components/AttendanceActionCard";
import "../styles/AttendancePage.css";

function AttendancePage() {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    if (!eventId) {
      setError("Invalid event link");
      setLoading(false);
      return;
    }

    supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setError("Event not found");
        } else {
          setEvent(data);
        }
        setLoading(false);
      });
  }, [eventId]);


  useEffect(() => {
    const loadUserState = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user || !eventId) return;


      const { data: reg } = await supabase
        .from("event_participants")
        .select("id")
        .eq("event_id", eventId)
        .eq("email", user.email)
        .maybeSingle();

      setIsRegistered(Boolean(reg));


      const { data: attendance } = await supabase
        .from("attendance")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();

      setAttendanceMarked(Boolean(attendance));
    };

    loadUserState();
  }, [eventId]);

  const handleMarkAttendance = async () => {
    if (!isRegistered) {
      alert("You are not registered for this event");
      return;
    }

    if (attendanceMarked) {
      alert("Attendance already marked");
      return;
    }

    const { data } = await supabase.auth.getUser();

    const { error } = await supabase.from("attendance").insert({
      event_id: eventId,
      user_id: data.user.id,
    });

    if (error) {
      alert("Failed to mark attendance");
      return;
    }

    setAttendanceMarked(true);
  };

  if (loading) {
    return <p className="loading-text">Loading attendance…</p>;
  }

  if (error) {
    return (
      <div className="error-text card">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }


  const now = new Date();
  const start = new Date(event.startTime);
  const end = new Date(event.endTime);
  const isLive = now >= start && now <= end;

  return (
    <div className="attendance-page">
      <EventSummaryCard event={event} isLive={isLive} />

      <div className="attendance-main">
        <GeoFenceCard event={event} />

        <AttendanceActionCard
            attendanceMarked={attendanceMarked}
            isLive={isLive}
            isRegistered={isRegistered}
            onMark={handleMarkAttendance}
            onViewEvents={() => (window.location.href = "/")}
        />

        {!isRegistered && (
          <p className="warning">
            You are not registered for this event
          </p>
        )}
      </div>
    </div>
  );
}

export default AttendancePage;
