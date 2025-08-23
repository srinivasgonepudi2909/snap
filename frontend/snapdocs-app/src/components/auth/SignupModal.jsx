const API = process.env.REACT_APP_BACKEND_URL;

fetch(`${API}/signup`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: name, email, password })  // ✅ Fix here
})
  .then(res => res.json())
  .then(data => {
    console.log("✅ Signup success:", data);
    alert(data.message);  // Show feedback on success
  })
  .catch(err => {
    console.error("❌ Signup failed:", err);
    alert("Signup failed. Please try again.");
  });
