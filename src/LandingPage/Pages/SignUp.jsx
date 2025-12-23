import React, { useEffect, useState } from "react";
import AppNavbarr from "../Components/AppNavbarr";
import "../styles/SignUp.css";
import { supabase } from "../../Supabase/supabase-client";
import { useNavigate, useLocation } from "react-router-dom";

const AuthBox = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    location.state?.redirectTo ||
    new URLSearchParams(location.search).get("redirect") ||
    "/admin";

  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          navigate(redirectTo, { replace: true });
        }
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [navigate, redirectTo]);

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + redirectTo,
      },
    });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <AppNavbarr />

      <div className="auth-container">
        <div className="auth-box">
          <h2>Continue with Google</h2>

          <button
            className="auth-btn google-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? "Redirecting..." : "Sign in with Google"}
          </button>

          {authError && (
            <p
              className="auth-error"
              style={{ color: "salmon", marginTop: "14px" }}
            >
              {authError}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthBox;
