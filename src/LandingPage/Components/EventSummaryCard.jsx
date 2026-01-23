function EventSummaryCard({ event, isLive, userTZ }) {

  const parseISODate = (s) => {
    if (!s) return null;
    return new Date(s); 
  };

  const start = parseISODate(event.startTime);
  const end = parseISODate(event.endTime);

  const fmt = (d) => {
    if (!d || isNaN(d)) return "—";

    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }).format(d);
  };

  return (
    <div className="card event-summary">
      <div className="event-status">
        <span className={`dot ${isLive ? "live" : "closed"}`} />
        <span>{isLive ? "LIVE EVENT" : "EVENT CLOSED"}</span>
      </div>

      <h1 className="event-id">{event.name}</h1>

      <p className="event-name">{event.venue}</p>

      <p className="event-time">
        {fmt(start)} – {fmt(end)}
      </p>

      <small style={{ opacity: 0.75 }}>
        Times shown in Asia/Kolkata
      </small>
    </div>
  );
}

export default EventSummaryCard;
