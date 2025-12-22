import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../Supabase/supabase-client";

import EventSummaryCard from "../Components/EventSummaryCard";
import GeoFenceCard from "../Components/GeofenceCard";
import AttendanceActionCard from "../Components/AttendanceActionCard";
import "../styles/AttendancePage.css";

function AttendancePage() {
  const { eventId } = useParams();

  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ======================
     AUTH
     ====================== */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session ?? null);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session ?? null);
        setAuthLoading(false);
      }
    );

    return () => listener?.subscription?.unsubscribe();
  }, []);

  /* ======================
     LOAD EVENT
     ====================== */
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

  /* ======================
     CHECK REGISTRATION + ATTENDANCE
     ====================== */
  useEffect(() => {
    if (!session || !eventId) return;

    const email = session.user.email;
    const userId = session.user.id;

    // 1. Check if student is registered
    supabase
      .from("event_participants")
      .select("id")
      .eq("event_id", eventId)
      .eq("email", email)
      .maybeSingle()
      .then(({ data }) => {
        setIsRegistered(Boolean(data));
      });

    // 2. Check if attendance already marked
    supabase
      .from("attendance")
      .select("id")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        setAttendanceMarked(Boolean(data));
      });
  }, [session, eventId]);

  /* ======================
     MARK ATTENDANCE
     ====================== */
  const handleMarkAttendance = async () => {
    if (!session) {
      window.location.href = `/signup?redirect=${encodeURIComponent(`/attendance/${eventId}`)}`;
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

  /* ======================
     RENDER STATES
     ====================== */
  if (authLoading || loading) {
    return <p className="loading-text">Loading attendance…</p>;
  }

  // If the user is not authenticated, redirect them to signup immediately
  if (!session) {
    window.location.href = `/signup?redirect=${encodeURIComponent(`/attendance/${eventId}`)}`;
    return null;
  }

  if (error) {
    return (
      <div className="error-text card">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  /* ======================
     EVENT TIME CHECK
     ====================== */

  if (!event) {
    return (
      <div className="error-text card" style={{ maxWidth: 420 }}>
        <h3>Invalid or expired event</h3>
        <p>If you scanned a QR, the event ID <code>{eventId}</code> may be incorrect or expired.</p>
        <button className="secondary-btn" onClick={() => (window.location.href = "/")}>View Events</button>
      </div>
    );
  }

  const parseISODate = (s) => {
    if (!s) return null;
    const hasTZ = /Z|[+-]\d{2}(:\d{2})?/.test(s);
    return new Date(hasTZ ? s : s + "Z");
  };

  const start = parseISODate(event.start_time);
  const end = parseISODate(event.end_time);
  const now = new Date();
  const isLive = start && end && now >= start && now <= end;

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

        {!session && (
          <p className="warning">Please sign in to mark attendance</p>
        )}

        {session && !isRegistered && (
          <p className="warning">
            You are not registered for this event
          </p>
        )}
      </div>
    </div>
  );
}

export default AttendancePage;
