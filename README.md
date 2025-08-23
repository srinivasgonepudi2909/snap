# 📝 SnapDocs Auth Service – Phase 1 (Backend + MongoDB)

This project sets up the **authentication backend** using FastAPI and connects it to **MongoDB** using Docker. It includes:

- 🔐 Signup/Login APIs (with JWT token)
- 🧠 MongoDB storage (Dockerized)
- ⚙️ Swagger UI for testing
- 🐳 Docker Compose for managing containers

---

## 📁 Folder Structure (Important)
```
snap/
├── backend/               # FastAPI backend (auth service)
│   └── services/
│       └── auth-service/
│           ├── app/
│           │   ├── api/routes.py         # Signup/Login logic
│           │   ├── utils/config.py       # MongoDB connection
│           │   └── .env                  # Backend config
│           └── Dockerfile
├── frontend/              # (Optional) React app folder - not covered in Phase 1
├── database/              # MongoDB Docker setup
│   ├── Dockerfile         # Custom MongoDB image with user seed
│   └── init.js            # Initializes MongoDB user + sample admin
├── docker-compose.yml     # Compose file to run all containers
└── README.md              # (← you're here!)
```

---

## 🧰 Prerequisites

- Docker installed ✅  
- Docker Compose installed ✅  
  > Tip: Use `docker-compose` (hyphenated) on Amazon Linux

---

## 🚀 Step-by-Step Setup Instructions

### 1️⃣ Clone the repo
```bash
git clone <your-repo-url>
cd snap
```

---

### 2️⃣ Verify `.env` for backend

**File**: `backend/services/auth-service/app/.env`

```env
SECRET_KEY=snapdocs123
ACCESS_TOKEN_EXPIRE_MINUTES=60
MONGO_URI=mongodb://Chaitra:changeme123@snapdocs-mongo:27017/snapdocs?authSource=admin
```

---

### 3️⃣ Check MongoDB seeding file

**File**: `database/init.js`

```js
// Create MongoDB user
db = db.getSiblingDB("admin");
db.createUser({
  user: "Chaitra",
  pwd: "changeme123",
  roles: [{ role: "readWrite", db: "snapdocs" }]
});

// Seed sample admin user
db = db.getSiblingDB("snapdocs");
db.createCollection("users");
db.users.insertOne({
  name: "Chaitra",
  email: "chaitra@example.com",
  password: "changeme123", // Not hashed for now
  role: "admin"
});
```

---

### 4️⃣ Final `config.py` (DON’T miss this)

**File**: `backend/services/auth-service/app/utils/config.py`

```python
client = MongoClient(settings.MONGO_URI)
db = client["snapdocs"]  # ✅ This must match init.js!
user_collection = db["users"]
```

---

### 5️⃣ Start the project (backend + MongoDB)
```bash
docker-compose down -v      # Clean any old containers
docker-compose up --build -d
```

✅ This will:
- Build MongoDB with seeded user
- Start FastAPI backend and connect to DB

---

### 6️⃣ Test the Backend

#### 🔗 Open Swagger UI:
```
http://<your-ec2-ip>:8000/docs
```

#### 🧪 Try `/signup`
Use:
```json
{
  "name": "Test",
  "email": "test@example.com",
  "password": "test123"
}
```

#### 🔒 Try `/login`  
Then use the returned token to call `/me` or `/dashboard`.

---

### 7️⃣ Verify in MongoDB (Optional)

```bash
docker exec -it snapdocs-mongo mongosh -u Chaitra -p changeme123 --authenticationDatabase admin
```

Then:
```js
use snapdocs
db.users.find().pretty()
```

---

## ✅ Phase 1 Complete

By the end of this phase, you have:
- MongoDB with seeded and runtime users
- Signup/Login APIs
- Working containerized backend

---

## 🔜 Coming Next (Phase 2 Ideas)
- Integrate frontend login form (React)
- JWT-based dashboard access
- Store `createdAt`, log IP, audit log
- Add hashed passwords in seed (`bcrypt`)
- Email verification / OTP / reset password

---