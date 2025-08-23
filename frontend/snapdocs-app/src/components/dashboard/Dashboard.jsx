import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  return (
    <div className="dashboard">
      <h2>Welcome{username ? `, ${username}` : ""}!</h2>
    </div>
  );
};

export default Dashboard;
