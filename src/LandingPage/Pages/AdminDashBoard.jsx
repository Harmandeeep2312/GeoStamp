import { useEffect, useState } from "react";
import { supabase } from "../../Supabase/supabase-client";
import ViewEvents from "../Components/ViewEvents";
import EventDetailsPopUp from "../Components/EventDetailsPopUp";
import EventsCreationPopUp from "../Components/EventsCreationPopUp";
import SignUp from "./SignUp";
import "../styles/AdminDashboard.css";
import AppNavbar from "../Components/AppNavbarr";

function AdminDashboard() {
    const [session, setSession] = useState(null);
    const [eventsData, setEventsData] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [createOpen, setCreateOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const fetchEvents = async (userId) => {
        if( !userId) return;
        const { data, error } = await supabase.from("events").select("*").eq("created_by", session.user.id);
        if (!error) {
        setEventsData(data || []);
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            const session = data.session;
        setSession(session);
        setLoading(false);

        if (session?.user?.id) {
            fetchEvents(session.user.id);
        }
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
            setSession(session);
            setLoading(false);

            if (session?.user?.id) {
            fetchEvents(session.user.id);
            } else {
            setEventsData([]);
            }
        }
        );

        return () => {
        listener?.subscription?.unsubscribe();
        };
    }, []);

    if (loading) {
        return (
        <div style={{ color: "white", padding: "40px" }}>
            Loading admin dashboard...
        </div>
        );
    }

    if (!session) {
        return <SignUp />;
    }

    const handleCardClick = (event) => {
        setSelectedEvent(event);
        setDetailsOpen(true);
    };

    const handleDeleteEvent = (id) => {
        setEventsData((prev) => prev.filter((e) => e.id !== id));
        setDetailsOpen(false);
    };

    return (
        <div className="Admin-page">
        <AppNavbar />
        <div className="Admin-wrapper">
            <div className="admin-header">
            <h1>Admin Dashboard</h1>
            <button onClick={() => setCreateOpen(true)}>Create Event</button>
            </div>

            <div className="admin-events">
            {eventsData.map((event) => (
                <ViewEvents
                key={event.id}
                event={event}
                onClick={() => handleCardClick(event)}
                />
            ))}
            </div>

            <EventsCreationPopUp
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            onCreated={fetchEvents}   // 🔥 KEY FIX
            />

            <EventDetailsPopUp
            open={detailsOpen}
            event={selectedEvent}
            onClose={() => setDetailsOpen(false)}
            onDelete={handleDeleteEvent}
            />
        </div>
        </div>
    );
}

export default AdminDashboard;
