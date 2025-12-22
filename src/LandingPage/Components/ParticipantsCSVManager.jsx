import Papa from "papaparse";
import "../styles/ParticipantsCSV.css";

function ParticipantsCSVManager({
    csvInfo,
    onUpload,
    onReplace,
    }) {
    const handleFile = (file) => {
        if (!file) return;

        Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => onUpload(res.data, file.name),
        });
    };

    return (
        <div className="csv-section">
        <h3 className="section-title">👥 Participants List</h3>

        {csvInfo ? (
            <>
            <p className="success-text">
                ✅ CSV Uploaded: <b>{csvInfo}</b>
            </p>

            <label className="csv-btn">
                CHANGE CSV
                <input
                type="file"
                accept=".csv"
                hidden
                onChange={(e) => handleFile(e.target.files[0])}
                />
            </label>
            </>
        ) : (
            <>
            <p className="hint-text">
                Upload a CSV file to restrict attendance only to listed participants.
            </p>

            <label className="csv-btn">
                UPLOAD CSV
                <input
                type="file"
                accept=".csv"
                hidden
                onChange={(e) => handleFile(e.target.files[0])}
                />
            </label>
            </>
        )}
        </div>
    );
}

export default ParticipantsCSVManager;
