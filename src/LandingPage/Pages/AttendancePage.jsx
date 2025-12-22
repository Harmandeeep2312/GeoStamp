import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../Supabase/supabase-client";

import EventSummaryCard from "../Components/EventSummaryCard";
import GeoFenceCard from "../Components/GeofenceCard";
import AttendanceActionCard from "../Components/AttendanceActionCard";
import DeviceInfo from "../Components/DeviceInfo";
import "../styles/AttendancePage.css";

/* ======================
   MOBILE-SAFE DEVICE ID
   ====================== */
const generateDeviceId = () => {
  try {
    const existing = localStorage.getItem("device_id");
    if (existing) return existing;

    const id = `dm-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
    localStorage.setItem("device_id", id);
    return id;
  } catch {
    return `dm-temp-${Date.now()}`;
  }
};

function AttendancePage() {
  const { eventId } = useParams();

  const [deviceId, setDeviceId] = useState(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [event, setEvent] = useState(null);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const actionRef = useRef(null);

  /* ======================
     AUTH (SAFE)
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
     DEVICE ID (AFTER MOUNT)
     ====================== */
  useEffect(() => {
    setDeviceId(generateDeviceId());
  }, []);

  /* ======================
     FETCH EVENT (PUBLIC)
     ====================== */
  useEffect(() => {
    let cancelled = false;

    if (!eventId) {
      setErrorMsg("Invalid event link");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (cancelled) return;

        if (error || !data) {
          setErrorMsg("Invalid or expired event");
          setLoading(false);
          return;
        }

        setEvent(data);
        setLoading(false);
      } catch {
        if (cancelled) return;
        setErrorMsg("Failed to load event");
        setLoading(false);
      }
    };

    fetchEvent();
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  /* ======================
     CHECK ATTENDANCE
     ====================== */
  useEffect(() => {
    let cancelled = false;

    if (!session || !deviceId || !eventId) return;

    const checkAttendance = async () => {
      const { data } = await supabase
        .from("attendance")
        .select("id")
        .eq("event_id", eventId)
        .eq("device_id", deviceId)
        .maybeSingle();

      if (!cancelled) {
        setAttendanceMarked(Boolean(data));
      }
    };

    checkAttendance();
    return () => {
      cancelled = true;
    };
  }, [session, deviceId, eventId]);

  /* ======================
     MARK ATTENDANCE
     ====================== */
  const handleMarkAttendance = async () => {
    if (!session) {
      window.location.href = "/signup";
      return;
    }

    const { error } = await supabase.from("attendance").insert({
      event_id: event.id,
      device_id: deviceId,
    });

    if (error) {
      alert("Attendance already marked or not allowed");
      return;
    }

    setAttendanceMarked(true);
  };

  /* ======================
     AUTO SCROLL
     ====================== */
  useEffect(() => {
    if (!loading && actionRef.current) {
      setTimeout(() => {
        actionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 150);
    }
  }, [loading]);

  /* ======================
     RENDER STATES
     ====================== */
  if (authLoading || !deviceId) {
    return <p className="loading-text">Preparing attendance…</p>;
  }

  if (loading) {
    return <p className="loading-text">Loading event…</p>;
  }

  if (errorMsg) {
    return (
      <div className="error-text card" style={{ maxWidth: 420 }}>
        <h3>Error</h3>
        <p>{errorMsg}</p>
        <button onClick={() => (window.location.href = "/")}>
          View Events
        </button>
      </div>
    );
  }

  /* ======================
     TIME CHECK
     ====================== */
  const parseISODate = (s) => {
    if (!s) return null;
    const hasTZ = /Z|[+-]\d{2}(:\d{2})?/.test(s);
    return new Date(hasTZ ? s : s + "Z");
  };

  const startDate = parseISODate(event.start_time);
  const endDate = parseISODate(event.end_time);
  const now = new Date();
  const isLive = startDate && endDate && now >= startDate && now <= endDate;

  const userTZ =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "local";

  /* ======================
     MAIN UI
     ====================== */
  return (
    <div className="attendance-page">
      <EventSummaryCard event={event} isLive={isLive} userTZ={userTZ} />

      <div className="attendance-main">
        <GeoFenceCard event={event} />

        <div ref={actionRef}>
          <AttendanceActionCard
            attendanceMarked={attendanceMarked}
            isLive={isLive}
            onMark={handleMarkAttendance}
            onViewEvents={() => (window.location.href = "/")}
          />
        </div>
      </div>

      <DeviceInfo deviceId={deviceId} />
    </div>
  );
}

export default AttendancePage;
