import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ MUST be inside the component

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("username", data.username);

        // ✅ Redirect to landing page
        navigate("/dashboard");
      } else {
        alert("Invalid credentials!");
      }
    } catch (err) {
      console.error("Login error", err);
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
