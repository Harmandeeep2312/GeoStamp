function EventSummaryCard({ event, isLive, userTZ }) {

  const parseISODate = (s) => {
    if (!s) return null;
    return new Date(s); // ✅ DO NOT append Z
  };

  const start = parseISODate(event.start_time);
  const end = parseISODate(event.end_time);

  const timezone =
    userTZ || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fmt = (d) => {
    if (!d || isNaN(d)) return "—";

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: timezone,
    }).format(d);
  };

  return (
    <div className="card event-summary">
      <div className="event-status">
        <span className={`dot ${isLive ? "live" : "closed"}`} />
        <span>{isLive ? "LIVE EVENT" : "EVENT CLOSED"}</span>
      </div>

      <h3 className="event-id">{event.name}</h3>

      <p className="event-name">{event.venue}</p>

      <p className="event-time">
        {fmt(start)} – {fmt(end)}
      </p>

      <small style={{ opacity: 0.75 }}>
        Times shown in {timezone}
      </small>
    </div>
  );
}

export default EventSummaryCard;
