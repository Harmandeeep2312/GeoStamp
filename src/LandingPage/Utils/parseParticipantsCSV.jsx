    import Papa from "papaparse";

    const normalize = (h) =>
    h
        .replace(/^\uFEFF/, "")      // remove BOM
        .replace(/\u00A0/g, " ")     // remove non-breaking spaces
        .trim()
        .toLowerCase();

    export function parseParticipantsCSV(file, onSuccess, onError) {
    if (!file) return;

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        encoding: "utf-8",
        transformHeader: normalize,

        complete: (results) => {
        const rows = results.data;

        if (!rows || rows.length === 0) {
            onError?.("CSV is empty");
            return;
        }

        // ✅ Validate against normalized row keys (single source of truth)
        const headers = Object.keys(rows[0]).map(normalize);
        const required = ["name", "email", "roll_no"];

        const isValid = required.every((c) => headers.includes(c));

        if (!isValid) {
            onError?.("CSV must contain columns: name, email, roll_no");
            return;
        }

        onSuccess(rows, file.name);
        },
    });
    }
