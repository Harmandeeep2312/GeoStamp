function AttendanceActionCard({ attendanceMarked, isLive, onMark, onViewEvents, highlight = false }) {
    return (
        <div className={`card attendance-action ${highlight ? "highlight" : ""}`}>
        <h2>Ready to Mark Attendance</h2>

        <p className="muted">
            Click the button below to verify your location and mark attendance
        </p>

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
            disabled={!isLive}
            autoFocus={highlight && isLive}
            >
            MARK ATTENDANCE
            </button>
        )}
        </div>
    );
}

export default AttendanceActionCard;
