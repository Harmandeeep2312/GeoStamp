function EventSummaryCard({ event, isLive, userTZ }) {
    // parse timestamps and assume UTC if timezone missing
    const parseISODate = (s) => {
        if (!s) return null;
        const hasTZ = /Z|[+-]\d{2}(:\d{2})?/.test(s);
        return new Date(hasTZ ? s : s + "Z");
    };

    const start = parseISODate(event.start_time);
    const end = parseISODate(event.end_time);

    const fmt = (d) => {
        if (!d) return "—";
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
            timeZoneName: "short",
        }).format(d);
    };

    return (
        <div className="card event-summary">
        <div className="event-status">
            <span className={`dot ${isLive ? "live" : "closed"}`} />
            <span>{isLive ? "LIVE EVENT" : "EVENT CLOSED"}</span>
        </div>

        <h3 className="event-id">{event.id}</h3>

        <p className="event-name">{event.name}</p>

        <p className="event-time">
            {fmt(start)} – {fmt(end)}
        </p>
        <small style={{ opacity: 0.75 }}>Times shown in {userTZ || Intl.DateTimeFormat().resolvedOptions().timeZone}</small>
        </div>
    );
}

export default EventSummaryCard;
