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

  const handleSignUpChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUpSubmit = async(e) => {
    e.preventDefault();

    const signupData = {
      name: form.name,
      email: form.email,
      password: form.password,
    };
    const {data} = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      data: {
        name: form.name,
      }
    }
    })
    console.log("Signup JSON:", JSON.stringify(signupData, null, 2));
    setForm({
      name: "",
      email: "",
      password: "",
    });
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

            <button type="submit" className="auth-btn">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthBox;
