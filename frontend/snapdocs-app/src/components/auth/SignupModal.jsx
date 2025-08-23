const API = process.env.REACT_APP_BACKEND_URL;

fetch(`${API}/signup`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, password })
})
