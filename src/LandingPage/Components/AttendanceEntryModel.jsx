import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QrScanner from "./QrScanner";
import ManualLinkInput from "./ManualLinkInput";
import "../styles/AttendanceModel.css";

function AttendanceEntryModal({ open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle className="attendance-title">
            Enter Attendance
            <IconButton
            onClick={onClose}
            sx={{ position: "absolute", right: 12, top: 12 }}
            >
            <CloseIcon />
            </IconButton>
        </DialogTitle>

        <DialogContent className="attendance-modal">
            <div className="scan-section">
            <h3>Scan QR Code</h3>
            <QrScanner onClose={onClose} />
            </div>

            <div className="divider">OR</div>

            <ManualLinkInput onClose={onClose} />
        </DialogContent>
        </Dialog>
    );
}

export default AttendanceEntryModal;
