import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../Supabase/supabase-client";

import EventSummaryCard from "../Components/EventSummaryCard";
import GeoFenceCard from "../Components/GeofenceCard";
import AttendanceActionCard from "../Components/AttendanceActionCard";
import "../styles/AttendancePage.css";

function AttendancePage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- AUTH (NON-BLOCKING) ---------------- */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session ?? null);
      setAuthChecked(true);
    });
  }, []);

  /* ---------------- LOAD EVENT (PUBLIC) ---------------- */
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
          setError("Event not found or expired");
        } else {
          setEvent(data);
        }
        setLoading(false);
      });
  }, [eventId]);

  /* ---------------- VALIDATIONS (AFTER LOGIN) ---------------- */
  useEffect(() => {
    if (!session || !eventId) return;

    const email = session.user.email;
    const userId = session.user.id;

    supabase
      .from("event_participants")
      .select("id")
      .eq("event_id", eventId)
      .eq("email", email)
      .maybeSingle()
      .then(({ data }) => setIsRegistered(Boolean(data)));

    supabase
      .from("attendance")
      .select("id")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => setAttendanceMarked(Boolean(data)));
  }, [session, eventId]);

  /* ---------------- MARK ATTENDANCE ---------------- */
  const handleMarkAttendance = async () => {
    if (!session) {
      navigate(`/signup?redirect=/attendance/${eventId}`);
      return;
    }

    if (!isRegistered) {
      alert("You are not registered for this event");
      return;
    }

    if (attendanceMarked) {
      alert("Attendance already marked");
      return;
    }

    const { error } = await supabase.from("attendance").insert({
      event_id: eventId,
      user_id: session.user.id,
    });

    if (error) {
      alert("Failed to mark attendance");
      return;
    }

    setAttendanceMarked(true);
  };

  /* ---------------- RENDER ---------------- */

  if (loading) {
    return <p className="loading-text">Loading event…</p>;
  }

  if (error) {
    return (
      <div className="card error-text">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  const parseISO = (s) => new Date(s.endsWith("Z") ? s : s + "Z");
  const isLive =
    new Date() >= parseISO(event.start_time) &&
    new Date() <= parseISO(event.end_time);

  return (
    <div className="attendance-page">
      {/* ALWAYS visible */}
      <EventSummaryCard event={event} isLive={isLive} />

      <div className="attendance-main">
        <GeoFenceCard event={event} />

        <AttendanceActionCard
          attendanceMarked={attendanceMarked}
          isLive={isLive}
          onMark={handleMarkAttendance}
          onViewEvents={() => navigate("/")}
        />

        {!session && (
          <p className="warning">Please sign in to mark attendance</p>
        )}

        {session && !isRegistered && (
          <p className="warning">You are not registered for this event</p>
        )}
      </div>
    </div>
  );
}

export default AttendancePage;
