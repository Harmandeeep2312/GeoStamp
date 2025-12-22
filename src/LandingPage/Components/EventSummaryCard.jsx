function EventSummaryCard({ event, isLive }) {
    return (
        <div className="card event-summary">
        <div className="event-status">
            <span className={`dot ${isLive ? "live" : "closed"}`} />
            <span>{isLive ? "LIVE EVENT" : "EVENT CLOSED"}</span>
        </div>

        <h3 className="event-id">{event.id}</h3>

        <p className="event-name">{event.name}</p>

        <p className="event-time">
            {new Date(event.start_time).toLocaleString()} –{" "}
            {new Date(event.end_time).toLocaleString()}
        </p>
        </div>
    );
}

export default EventSummaryCard;
