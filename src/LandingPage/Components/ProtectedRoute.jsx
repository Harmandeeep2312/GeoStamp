import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../../Supabase/supabase-client";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
      setLoading(false);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Checking authentication…</div>;
  }

  if (!session) {
    return (
      <Navigate to="/signup" replace state={{ redirectTo: location.pathname }} />
    );
  }

  return children;
}
