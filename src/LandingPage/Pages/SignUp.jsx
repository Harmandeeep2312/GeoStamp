import React, { useState } from "react";
import AppNavbarr from "../Components/AppNavbarr";
import "../styles/SignUp.css";
import { supabase } from "../../Supabase/supabase-client";
import { useNavigate } from "react-router-dom";

const AuthBox = () => {
  const navigatee = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [authError, setAuthError] = useState(null);
  const [loadingSignUp, setLoadingSignUp] = useState(false);

  const handleSignUpChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUpSubmit = async(e) => {
    e.preventDefault();
    setAuthError(null);
    setLoadingSignUp(true);

    const signupData = {
      name: form.name,
      email: form.email,
      password: form.password,
    };

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
        },
      },
    });

    if (error) {
      setAuthError(error.message);
      setLoadingSignUp(false);
      return;
    }

    // If Supabase returned a session, the user is already signed in
    if (data?.session) {
      setForm({ name: "", email: "", password: "" });
      setLoadingSignUp(false);
      navigatee("/admin");
      return;
    }

    // Some Supabase configurations don't create an immediate session on signUp
    // Try signing in immediately (useful when email confirmations are disabled)
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (signInError) {
      setAuthError(signInError.message || "Please confirm your email or sign in.");
      setLoadingSignUp(false);
      return;
    }

    // Signed in successfully
    setForm({ name: "", email: "", password: "" });
    setLoadingSignUp(false);
    navigatee("/admin");
  };

  return (
    <>
      <AppNavbarr />

      <div className="auth-container">
        <div className="auth-box">
          <h2>Create Account</h2>

          <form onSubmit={handleSignUpSubmit}>
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleSignUpChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleSignUpChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleSignUpChange}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            {authError && (
              <p className="auth-error" style={{ color: "salmon", marginTop: "12px" }}>
                {authError}
              </p>
            )}
            <button type="submit" className="auth-btn" disabled={loadingSignUp}>
              {loadingSignUp ? "Creating..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthBox;
