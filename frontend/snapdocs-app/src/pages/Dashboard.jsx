import React from 'react';
import '../styles/components/Dashboard.css';

export default function Dashboard() {
  const username = localStorage.getItem("username") || "User";
  const { documents, loading } = useDocuments();

  // Extract unique folder names
  const folders = [...new Set(documents.map((doc) => doc.folder || "Uncategorized"))];

  // Take 5 most recent uploads
  const recentUploads = documents.slice(0, 5);

  // Fake activity log for now (optional: replace with real logic later)
  const activityLog = recentUploads.map((doc) => ({
    name: doc.name,
    action: "Uploaded",
    time: "Just now",
  }));

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

          {loading ? (
            <p>Loading folders...</p>
          ) : (
            <div className="folders">
              {folders.map((folder) => (
                <div key={folder} className="folder">
                  📁 <span>{folder}</span>
                </div>
              ))}
            </div>
          )}

          <div className="upload-hint">Drag and drop files here</div>
        </section>
      </main>

      <aside className="right-panel">
        <div className="recent-uploads">
          <h4>Recent Uploads</h4>
          <ul>
            {recentUploads.map((file) => (
              <li key={file._id || file.name}>{file.name}</li>
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
