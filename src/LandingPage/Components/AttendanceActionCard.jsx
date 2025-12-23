function AttendanceActionCard({ attendanceMarked, isLive,isRegistered,onMark,onViewEvents,highlight = false,}) {
    return (
        <div className={`card attendance-action ${highlight ? "highlight" : ""}`}>
        <h2>Ready to Mark Attendance</h2>

        <p className="muted">
            Click the button below to verify your location and mark attendance
        </p>
        {!isRegistered && (
            <p className="warning">
            You are not registered for this event
            </p>
        )}
        {attendanceMarked ? (
            <>
            <p className="warning">⚠ Attendance already marked</p>
            <button className="secondary-btn" onClick={onViewEvents}>
                VIEW OTHER EVENTS
            </button>
            </>
        ) : (
            <button
            className="primary-btn"
            onClick={onMark}
            disabled={!isLive || !isRegistered}
            autoFocus={highlight && isLive}
            >
            MARK ATTENDANCE
            </button>
        )}
        {!isLive && !attendanceMarked && (
            <p className="muted">
            Attendance can only be marked during the event time
            </p>
        )}
        </div>
    );
}

export default AttendanceActionCard;
