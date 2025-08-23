import React, { useState } from "react";

const SignupModal = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");

  const API = process.env.REACT_APP_BACKEND_URL;

  const handleSignup = async () => {
    try {
      const response = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ ${data.message}`);
        // Optional: redirect or close modal
      } else {
        alert(`❌ Signup failed: ${data.detail || "Unknown error"}`);
      }
    } catch (err) {
      alert("❌ Error signing up: " + err.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      /><br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      /><br />

      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default SignupModal;
