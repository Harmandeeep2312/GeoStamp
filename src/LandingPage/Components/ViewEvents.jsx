import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import '../styles/ViewEvents.css'

function ViewEvents({ event,onClick }) {
    const now = new Date();
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);

    let status = "UPCOMING";
    let statusClass = "status-upcoming";

    if (now >= start && now <= end) {
        status = "LIVE";
        statusClass = "status-live";
    } else if (now > end) {
        status = "ENDED";
        statusClass = "status-ended";
    }

    return (
        <Card className="event-card" onClick={onClick}>
        <CardContent className="event-card-content">
            <div className="event-card-header">
            <span className={`status-badge ${statusClass}`}>
                {status}
            </span>

            <div className="attendee-count">
                <PeopleOutlineIcon fontSize="small" />
                <span>1</span>
            </div>
            </div>

            <h2 className="event-name">{event.name}</h2>

            <div className="event-row">
            <LocationOnOutlinedIcon />
            <span>{event.venue}</span>
            </div>
            <div className="event-row">
            <CalendarMonthOutlinedIcon />
            <span>
                {start.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                })}
            </span>
            </div>
            <div className="event-row">
            <AccessTimeOutlinedIcon />
            <span>
                {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
                -{" "}
                {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            </div>
        </CardContent>
        </Card>
    );
}

export default ViewEvents;
