import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("🔍 Login attempt started");

    try {
      console.log("🌐 Sending request to:", `${process.env.REACT_APP_BACKEND_URL}/login`);
      
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("📊 Response status:", res.status);
      console.log("📊 Response headers:", Object.fromEntries(res.headers.entries()));
      
      const data = await res.json();
      console.log("📦 Response data:", data);

      if (data.access_token) {
        console.log("✅ Login successful, storing token");
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", data.username);
        console.log("💾 Token stored:", localStorage.getItem("token"));
        console.log("💾 Username stored:", localStorage.getItem("username"));

        console.log("🔄 Redirecting to dashboard...");
        navigate("/dashboard");
      } else {
        console.log("❌ No access token in response");
        alert("Invalid credentials!");
      }
    } catch (err) {
      console.error("🔥 Login error", err);
      alert("Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}