import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../Supabase/supabase-client";
import "../styles/AttendancePage.css";

function AttendancePage() {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [status, setStatus] = useState("");

  /* =====================
     LOAD EVENT
     ===================== */
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

  /* =====================
     MARK ATTENDANCE
     ===================== */
  const handleSubmit = async () => {
    setStatus("");

    if (!name || !rollNo) {
      setStatus("Please fill all fields");
      return;
    }

    // 1️⃣ Check participant registration
    const { data: participant } = await supabase
      .from("event_participants")
      .select("id")
      .eq("event_id", eventId)
      .eq("name", name)
      .eq("roll_no", rollNo)
      .maybeSingle();

    if (!participant) {
      setStatus("You are not registered for this event");
      return;
    }

    // 2️⃣ Check if attendance already marked
    const { data: existing } = await supabase
      .from("attendance")
      .select("id")
      .eq("event_id", eventId)
      .eq("roll_no", rollNo)
      .maybeSingle();

    if (existing) {
      setStatus("Attendance already marked");
      return;
    }

    // 3️⃣ Insert attendance
    const { error } = await supabase.from("attendance").insert({
      event_id: eventId,
      name,
      roll_no: rollNo,
    });

    if (error) {
      setStatus("Failed to mark attendance");
      return;
    }

    setStatus("✅ Attendance marked successfully");
    setName("");
    setRollNo("");
  };

  /* =====================
     RENDER STATES
     ===================== */
  if (loading) return <p className="loading-text">Loading attendance...</p>;

  if (error) {
    return (
      <div className="card error-text">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="attendance-page">
      <div className="card">
        <h2>{event.title}</h2>
        <p>{event.description}</p>
      </div>

      <div className="card">
        <h3>Mark Attendance</h3>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Roll Number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
        />

        <button className="primary-btn" onClick={handleSubmit}>
          MARK ATTENDANCE
        </button>

        {status && <p className="warning">{status}</p>}
      </div>
    </div>
  );
}

export default AttendancePage;
