import {Dialog,DialogTitle,DialogContent,IconButton,Button} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QRCode from "react-qr-code";
import '../styles/AttendanceSharePopUp.css'
function AttendanceSharePopUp({ open, onClose, eventId }) {
    const attendanceLink = `${window.location.origin}/attendance/${eventId}?from=qr`;

    const copyLink = async () => {
        await navigator.clipboard.writeText(attendanceLink);
        alert("Attendance link copied");
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700,color:'#ffff' }}>
            Share Attendance Link
            <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 12, top: 12 }}
            >
            <CloseIcon />
            </IconButton>
        </DialogTitle>

        <DialogContent className="share-popup">
            <div className="qr-box">
            <QRCode value={attendanceLink} size={180} />
            </div>
            <p className="share-label">Attendance Link</p>
            <div className="link-box">
            <span>{attendanceLink}</span>
            <Button onClick={copyLink} size="small">
                COPY
            </Button>
            </div>
            <div className="instructions">
            <h4>How students mark attendance</h4>
            <ol>
                <li>Scan the QR code or open the link</li>
                <li>Allow location access</li>
                <li>Be inside the event location</li>
                <li>Attendance can be marked only once per device</li>
            </ol>
            </div>
        </DialogContent>
        </Dialog>
    );
}

export default AttendanceSharePopUp;
