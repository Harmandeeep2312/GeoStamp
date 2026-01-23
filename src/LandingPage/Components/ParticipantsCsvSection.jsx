import { parseParticipantsCSV } from "../Utils/parseParticipantsCSV";
import * as XLSX from "xlsx";

function ParticipantsCSVSection({ onParticipantsLoaded }) {

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const ext = file.name.split(".").pop().toLowerCase();

        /* =======================
           CSV FILE
        ======================= */
        if (ext === "csv") {
            parseParticipantsCSV(
                file,
                (rows, filename) => {
                    onParticipantsLoaded(rows, filename);
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
           XLSX FILE
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

                    onParticipantsLoaded(rows, file.name);
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
        <div className="optional-section">
            <h4>Participants (Optional)</h4>

            <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileUpload}
            />

            <p className="hint-text">
                Upload CSV / Excel with columns:
                <b> name, email, roll_no</b>
            </p>

            <p className="hint-text">
                You can skip this and upload later from the dashboard.
            </p>
        </div>
    );
}

export default ParticipantsCSVSection;
