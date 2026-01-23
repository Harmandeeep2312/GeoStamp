import "../styles/ParticipantsCSV.css";
import { parseParticipantsCSV } from "../Utils/parseParticipantsCSV";
import * as XLSX from "xlsx";

function ParticipantsCSVManager({ csvInfo, onUpload }) {

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const ext = file.name.split(".").pop().toLowerCase();

        /* =======================
           CSV FILE HANDLING
        ======================= */
        if (ext === "csv") {
            parseParticipantsCSV(
                file,
                (rows, filename) => {
                    onUpload(rows, filename);
                    e.target.value = ""; // reset input
                },
                (err) => {
                    alert(err);
                    e.target.value = "";
                }
            );
            return;
        }

        /* =======================
           XLSX FILE HANDLING
        ======================= */
        if (ext === "xlsx") {
            const reader = new FileReader();

            reader.onload = (evt) => {
                try {
                    const data = new Uint8Array(evt.target.result);
                    const workbook = XLSX.read(data, { type: "array" });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];

                    const rows = XLSX.utils.sheet_to_json(sheet, {
                        defval: "",
                    });

                    if (!rows.length) {
                        alert("Excel file is empty");
                        return;
                    }

                    onUpload(rows, file.name);
                } catch (err) {
                    alert("Failed to read Excel file");
                } finally {
                    e.target.value = ""; // reset input
                }
            };

            reader.readAsArrayBuffer(file);
            return;
        }

        /* =======================
           INVALID FILE TYPE
        ======================= */
        alert("Only CSV or XLSX files are supported");
        e.target.value = "";
    };

    return (
        <div className="csv-section">
            <h3 className="section-title">👥 Participants List</h3>

            {csvInfo ? (
                <>
                    <p className="success-text">
                        ✅ File Uploaded: <b>{csvInfo}</b>
                    </p>

                    <label className="csv-btn">
                        CHANGE FILE
                        <input
                            type="file"
                            accept=".csv,.xlsx"
                            hidden
                            onChange={handleFile}
                        />
                    </label>
                </>
            ) : (
                <>
                    <p className="hint-text">
                        Upload a CSV or Excel file to restrict attendance
                        to listed participants.
                    </p>

                    <label className="csv-btn">
                        UPLOAD FILE
                        <input
                            type="file"
                            accept=".csv,.xlsx"
                            hidden
                            onChange={handleFile}
                        />
                    </label>
                </>
            )}
        </div>
    );
}

export default ParticipantsCSVManager;
