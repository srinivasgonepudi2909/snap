import { useNavigate } from "react-router-dom";
const navigate = useNavigate(); // inside your LoginModal component

// On form submit:
fetch(`${API}/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
})
  .then(res => res.json())
  .then(data => {
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", data.username); // 👈 store username
      
      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } else {
      // ❌ Handle login failure
      alert("Invalid credentials!");
    }
  })
  .catch(err => {
    console.error("Login error", err);
    alert("Something went wrong");
  });
