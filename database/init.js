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

db.createCollection("users");

db.users.insertOne({
  name: "Chaitra",
  email: "chaitra@example.com",
  password: "changeme123",
  role: "admin"
});
