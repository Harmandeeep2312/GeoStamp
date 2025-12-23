import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../Supabase/supabase-client";

const AttendanceProtectedRoute = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
        setSession(data.session);
        setLoading(false);
        });
    }, []);

    if (loading) {
        return <p style={{ padding: "40px" }}>Checking authentication…</p>;
    }

    if (!session) {
        return (
        <Navigate
            to={`/auth?redirect=${encodeURIComponent(location.pathname)}`}
            replace
        />
        );
    }

    return <Outlet />;
};

export default AttendanceProtectedRoute;
