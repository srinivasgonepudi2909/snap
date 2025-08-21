# 🛡️ Auth-Service – SnapDocs Microservice

This is the **Authentication Microservice** for the SnapDocs project. It handles user registration, login, password encryption, and JWT-based authentication. This service is built using **FastAPI** and uses **Poetry** for dependency management.

---

## 📦 Project Structure

```
auth-service/
├── app/
│   ├── api/                 # API endpoints (e.g., /signup, /login)
│   ├── models/              # Pydantic models for request/response
│   ├── services/            # Business logic (auth, jwt)
│   ├── utils/               # Utility modules (hashing, config)
│   └── main.py              # FastAPI app entry point
├── Dockerfile
├── pyproject.toml           # Poetry project configuration
├── poetry.lock              # Locked dependency versions
└── README.md
```

---

## 🧰 Tech Stack

| Layer           | Tech Used           |
|----------------|---------------------|
| Language        | Python 3.9+         |
| Framework       | FastAPI             |
| Auth            | JWT (via python-jose) |
| DB Driver       | PyMongo (MongoDB)   |
| Hashing         | bcrypt              |
| Environment     | python-dotenv       |
| Dependency Mgmt | Poetry              |
| Container       | Docker              |

---

## 🚀 Getting Started

### 1. Install Poetry (If not already installed)

```bash
curl -sSL https://install.python-poetry.org | python3 -
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Then verify:
```bash
poetry --version
```

---

### 2. Clone the Repository & Navigate

```bash
cd backend/services/auth-service
```

---

### 3. Create Virtual Environment & Install Dependencies

```bash
poetry env use python3.9
poetry install --no-root
```

> ✅ `poetry install` will install all required dependencies from `pyproject.toml` and lock them.

---

## 🔍 Status

| Module        | Status   |
|---------------|----------|
| Poetry Setup  | ✅ Done  |
| Folder Layout | ✅ Done  |
| Dependency Install | ✅ Done |
| `main.py`     | 🔄 Coming Next |

---

## ✍️ Author

**Srinivas Gonepudi**  
🔗 [GitHub](https://github.com/srinivasgonepudi2909)

---

## 📌 Next Steps

- Build `main.py` to start FastAPI server
- Add `/signup` and `/login` routes
- Connect to MongoDB
- Add JWT token generation
