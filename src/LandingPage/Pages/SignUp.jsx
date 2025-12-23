import React, { useEffect, useRef } from "react";
import AppNavbarr from "../Components/AppNavbarr";
import "../styles/SignUp.css";
import { supabase } from "../../Supabase/supabase-client";
import { useNavigate, useLocation } from "react-router-dom";

const AuthBox = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectedRef = useRef(false);

  /* ===============================
     STORE REDIRECT BEFORE OAUTH
     =============================== */
  useEffect(() => {
    const redirect =
      new URLSearchParams(location.search).get("redirect");

    if (redirect) {
      sessionStorage.setItem("postAuthRedirect", redirect);
    }
  }, [location.search]);

  /* ===============================
     REDIRECT AFTER LOGIN
     =============================== */
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session && !redirectedRef.current) {
          redirectedRef.current = true;

          const redirectTo =
            sessionStorage.getItem("postAuthRedirect") || "/admin";

          sessionStorage.removeItem("postAuthRedirect");

          navigate(redirectTo, { replace: true });
        }
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  /* ===============================
     START GOOGLE OAUTH
     =============================== */
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/auth",
      },
    });
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
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthBox;
