import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ManualLinkInput({ onClose }) {
    const [link, setLink] = useState("");
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (!link.includes("/attendance/")) {
        alert("Invalid attendance link");
        return;
        }

        const eventId = link.split("/attendance/")[1];
        navigate(`/attendance/${eventId}`);
        onClose?.();
    };

    return (
        <div className="manual-entry">
        <h3>Enter Attendance Link</h3>

        <div className="manual-input-row">
            <input
            type="text"
            placeholder="Paste attendance link here"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            />

            <button className="manual-submit-btn" onClick={handleSubmit}>
            CONTINUE
            </button>
        </div>
        </div>
    );
}

export default ManualLinkInput;
