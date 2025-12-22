import QRCode from "react-qr-code";
import "../styles/AttendanceShare.css";

function AttendanceShareSection({ eventId }) {
    const link = `${window.location.origin}/attendance/${eventId}`;

    return (
        <div className="share-section">
        <h3 className="section-title">📲 Share Attendance</h3>

        <p className="hint-text">
            Students can mark attendance by scanning the QR code or opening the link
            below while they are physically inside the geofence.
        </p>

        <div className="qr-box">
            <QRCode value={link} size={140} />
        </div>

        <div className="link-box">
            <input value={link} readOnly />
            <button onClick={() => navigator.clipboard.writeText(link)}>
            COPY LINK
            </button>
        </div>
        </div>
    );
}

export default AttendanceShareSection;
