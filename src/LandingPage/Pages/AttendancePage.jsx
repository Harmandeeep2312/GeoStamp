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
      window.location.href = "/signup";
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
  const now = new Date();
  const start = new Date(event.start_time);
  const end = new Date(event.end_time);
  const isLive = now >= start && now <= end;

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
