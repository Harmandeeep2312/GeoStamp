import React from "react";
import Papa from "papaparse";

function ParticipantsCSVSection({ onParticipantsLoaded }) {
    const handleCSVUpload = (file) => {
        if (!file) return;

        Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            const rows = results.data;

            // Basic validation
            const requiredCols = ["name", "email", "roll_no"];
            const isValid = requiredCols.every((col) =>
            Object.keys(rows[0] || {}).includes(col)
            );

            if (!isValid) {
            alert("CSV must contain columns: name, email, roll_no");
            return;
            }

            onParticipantsLoaded(rows, file.name);
        },
        });
    };

    return (
        <div className="optional-section">
        <h4>Participants (Optional)</h4>

        <input
            type="file"
            accept=".csv"
            onChange={(e) => handleCSVUpload(e.target.files[0])}
        />

        <p className="hint-text">
            Upload CSV with columns: <b>name, email, roll_no</b>
        </p>

        <p className="hint-text">
            You can skip this and upload later from the dashboard.
        </p>
        </div>
    );
}

export default ParticipantsCSVSection;
