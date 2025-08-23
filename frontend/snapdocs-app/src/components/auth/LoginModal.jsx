const API = process.env.REACT_APP_BACKEND_URL;

fetch(`${API}/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
})
  .then(res => res.json())
  .then(data => {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("username", data.username); // 👈 Store username
    // show success or redirect
  });
