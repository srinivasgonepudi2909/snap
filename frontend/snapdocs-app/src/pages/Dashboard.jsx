import React from 'react';
import '../../styles/components/Dashboard.css';

const folders = [
  "ID Cards", "PAN Card", "Passport", "Family",
  "Trip", "Vacations", "Work Docs", "Miscellaneous"
];

const recentUploads = [
  { name: "beach.jpg", time: "1 hour ago" },
  { name: "document.pdf", time: "3 hours ago" },
  { name: "portrait.png", time: "5 hours ago" },
];

const activityLog = [
  { name: "beach.jpg", action: "Uploaded", time: "2 hours ago" },
  { name: "document.pdf", action: "Moved", time: "3 hours ago" },
  { name: "portrait.png", action: "Deleted", time: "4 hours ago" },
];

export default function Dashboard() {
  const username = localStorage.getItem("username") || "User";

  return (
    <div className="container">
      <aside className="sidebar">
        <h2>SafeNest</h2>
        <ul>
          <li>Home</li>
          <li>All Files</li>
          <li>Photos</li>
          <li>Documents</li>
          <li>Shared</li>
          <li>Favorites</li>
          <li>Trash</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <input type="text" placeholder="Search..." />
          <img src="https://i.pravatar.cc/30" alt="user" />
        </header>

        {/* ✅ Welcome message */}
        <h2 style={{ marginTop: "20px", marginBottom: "20px" }}>
          Welcome, {username} 👋
        </h2>

        <section className="folder-area">
          <button className="new-folder">+ New Folder</button>
          <div className="folders">
            {folders.map((folder) => (
              <div key={folder} className="folder">
                📁 <span>{folder}</span>
              </div>
            ))}
          </div>
          <div className="upload-hint">Drag and drop files here</div>
        </section>
      </main>

      <aside className="right-panel">
        <div className="recent-uploads">
          <h4>Recent Uploads</h4>
          <ul>
            {recentUploads.map(file => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        </div>
        <div className="activity">
          <h4>Activity</h4>
          <ul>
            {activityLog.map((entry, i) => (
              <li key={i}>{entry.name} - {entry.action}</li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
