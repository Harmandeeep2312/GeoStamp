import Papa from "papaparse";

export const exportAttendanceCSV = (eventName, attendance) => {
    const csvData = attendance.map((a, index) => ({
        "S.No": index + 1,
        Name: a.event_participants.name,
        Email: a.event_participants.email,
        "Roll No": a.event_participants.roll_no,
        "Marked At": new Date(a.created_at).toLocaleString(),
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${eventName}-attendance.csv`;
    link.click();
};
