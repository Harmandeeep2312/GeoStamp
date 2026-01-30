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
  const [participantId, setParticipantId] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("DEBUG eventId:", eventId);

  useEffect(() => {
  supabase.auth.signOut();
}, []);



  useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    console.log("DEBUG session:", data.session);
    console.log(
      "DEBUG role:",
      data.session ? "authenticated" : "anon"
    );
  });
}, []);


  // Distance helper
  const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const toRad = (v) => (v * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // // Load event
  // useEffect(() => {
  //   if (!eventId) return;

  //   supabase
  //     .from("events")
  //     .select("*")
  //     .eq("id", eventId)
  //     .single()
  //     .then(({ data, error }) => {
  //       if (error || !data) setError("Event not found");
  //       else setEvent(data);
  //       setLoading(false);
  //     });
  // }, [eventId]);

  useEffect(() => {
  if (!eventId) return;

  supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .then(({ data, error }) => {
      console.log("DEBUG Supabase data:", data);
      console.log("DEBUG Supabase error:", error);

      if (!data || data.length === 0) {
        setError("Event not found (debug)");
      } else {
        setEvent(data[0]);
      }
      setLoading(false);
    });
}, [eventId]);


  useEffect(() => {
  const checkParticipant = async () => {
    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    // 👇 IMPORTANT: user is null until login happens
    if (!user || !eventId) {
      setIsRegistered(false);
      return;
    }

    const { data: participant } = await supabase
      .from("event_participants")
      .select("id, user_id, email")
      .eq("event_id", eventId)
      .or(`user_id.eq.${user.id},email.eq.${user.email}`)
      .maybeSingle();

    if (!participant) {
      setIsRegistered(false);
      return;
    }

    setIsRegistered(true);
    setParticipantId(participant.id);

    // Link participant → user (once)
    if (!participant.user_id) {
      await supabase
        .from("event_participants")
        .update({ user_id: user.id })
        .eq("id", participant.id);
    }

    const { data: attendance } = await supabase
      .from("attendance")
      .select("id")
      .eq("event_id", eventId)
      .eq("participant_id", participant.id)
      .maybeSingle();

    setAttendanceMarked(Boolean(attendance));
  };

  // 🔁 Re-run AFTER login happens
  const { data: sub } = supabase.auth.onAuthStateChange(() => {
    checkParticipant();
  });

  checkParticipant();

  return () => {
    sub.subscription.unsubscribe();
  };
}, [eventId]);


  const handleMarkAttendance = async () => {
    if (!isRegistered || !participantId) {
      alert("You are not registered for this event");
      return;
    }

    if (attendanceMarked) {
      alert("Attendance already marked");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        const distance = getDistanceInMeters(
          userLat,
          userLng,
          event.latitude,
          event.longitude
        );

        if (distance > event.radius) {
          alert("You are outside the allowed attendance area");
          return;
        }

        const { error } = await supabase.from("attendance").insert({
          event_id: eventId,
          participant_id: participantId,
        });

        if (error) {
          alert(error.message);
          return;
        }

        setAttendanceMarked(true);
      },
      () => alert("Location permission denied")
    );
  };

  if (loading) return <p className="loading-text">Loading attendance…</p>;

  if (error)
    return (
      <div className="error-text card">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );

  const now = new Date();
  const isLive =
    now >= new Date(event.startTime) &&
    now <= new Date(event.endTime);

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
          <p className="warning">You are not registered for this event</p>
        )}
      </div>
    </div>
  );
}

export default AttendancePage;
