import React from "react";
import { Button } from "@mui/material";
import { exportAttendanceCSV } from "../Utils/exportAttendanceCSV";
import "../styles/AttendanceTable.css";

function AttendanceTable({ eventName, attendance }) {
    if (attendance.length === 0) {
        return <p className="empty-text">No attendance marked yet.</p>;
    }

    return (
        <div className="attendance-wrapper">
        <div className="attendance-header">
            <h4>Attendance Records ({attendance.length})</h4>

            <Button size="small" onClick={() => exportAttendanceCSV(eventName, attendance)}>
            Download CSV
            </Button>
        </div>

        <table className="attendance-table">
            <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Roll No</th>
                <th>Time</th>
            </tr>
            </thead>

            <tbody>
            {attendance.map((a, idx) => (
                <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{a.event_participants.name}</td>
                <td>{a.event_participants.email}</td>
                <td>{a.event_participants.roll_no}</td>
                <td>{new Date(a.created_at).toLocaleTimeString()}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}

export default AttendanceTable;
