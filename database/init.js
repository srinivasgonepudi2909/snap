db = db.getSiblingDB('snapdocs');

db.createCollection('users');

db.users.insertOne({
  name: "Chaitra",
  email: "chaitra@example.com",
  password: "changeme123", // Use hashed password in production
  role: "admin"
});
