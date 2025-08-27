// Switch to the "admin" database for user creation
db = db.getSiblingDB("admin");

db.createUser({
  user: "Chaitra",
  pwd: "changeme123",
  roles: [
    {
      role: "readWrite",
      db: "snapdocs"
    }
  ]
});

// Now switch to the target database and create sample data
db = db.getSiblingDB("snapdocs");

// Create users collection and sample user
db.createCollection("users");

db.users.insertOne({
  name: "Chaitra",
  email: "chaitra@example.com",
  password: "changeme123",
  role: "admin"
});

// ===============================
// NEW: Create folders collection and default General folder
// ===============================
db.createCollection("folders");

// Create the default General folder
db.folders.insertOne({
  name: "General",
  description: "Default folder for documents uploaded directly to dashboard",
  color: "#6B7280",
  icon: "📂",
  created_at: new Date(),
  updated_at: new Date(),
  document_count: 0,
  is_default: true
});

// Create documents collection (for future use)
db.createCollection("documents");

// Print success messages
print("✅ Database 'snapdocs' initialized successfully!");
print("👤 User 'Chaitra' created");
print("📂 Default 'General' folder created");
print("📄 Collections: users, folders, documents created");
print("🎯 SnapDocs database is ready to use!");