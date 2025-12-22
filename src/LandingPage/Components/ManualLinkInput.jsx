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

        try {
        // If full URL, preserve pathname and search
        if (/^https?:\/\//i.test(link)) {
            const url = new URL(link);
            const path = `${url.pathname}${url.search}`;
            const searchParams = new URLSearchParams(url.search);
            if (!searchParams.get("from")) searchParams.set("from", "qr");
            navigate(`${url.pathname}?${searchParams.toString()}`);
            onClose?.();
            return;
        }
        // Otherwise, extract the attendance path portion
        const idx = link.indexOf("/attendance/");
        const remainder = link.slice(idx); // includes /attendance/...
        const [path, search] = remainder.split("?");
        const searchParams = new URLSearchParams(search || "");
        if (!searchParams.get("from")) searchParams.set("from", "qr");
        navigate(`${path}?${searchParams.toString()}`);
        onClose?.();
        } catch (e) {
        alert("Invalid link format");
        }
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
