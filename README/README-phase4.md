# 📦 Phase 4: MongoDB Integration, Password Hashing & JWT Token Generation

This phase introduces:

* MongoDB integration using `motor`
* Secure password hashing using `bcrypt`
* JWT token generation for login

---

## 📁 Folder Structure Updates

```
app/
├── services/
│   ├── auth.py              # Handles signup & login logic
│   └── jwt_handler.py       # JWT encoding/decoding helpers
├── utils/
│   ├── config.py            # Loads environment variables (MongoDB URI, secret)
│   └── hash.py              # Password hashing/verification functions
```

---

## ⚖️ Setup & Configuration

### 1. `.env` file (updated)

```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=snapdocs
SECRET_KEY=supersecretkey
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### 2. Install Requirements (if not already)

```bash
pip install motor bcrypt python-jose
```

---

## 🚀 What We Did in Code

### ✅ Signup (`/signup`)

* Email uniqueness check using MongoDB
* Password is **hashed with bcrypt** and stored securely

### ✅ Login (`/login`)

* Password is **verified against hash**
* If valid, a **JWT token** is generated

---

## 🧪 How to Test It – Swagger UI

### ▶️ Access Swagger:

`http://<your-ec2-ip>:8000/docs`

### 1. **Signup a User**

* Click `POST /signup`
* Input JSON:

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

* Click **Execute** → Should return 201 response

### 2. **Login and Get JWT**

* Click `POST /login`
* Input JSON:

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

* Click **Execute**
* ✅ **You will see:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

## 🔍 Verify JWT Token (Optional)

### 1. Go to [https://jwt.io](https://jwt.io)

* Paste the token
* You’ll see decoded values:

  * `sub`: user ID/email
  * `exp`: expiry
  * `iat`: issued at time

### 2. View in Browser DevTools

* Press `F12` → Network tab
* Perform login
* Look at the `/login` response
* You'll see `access_token` in **Response body**

---

## ✅ Phase 4 Outcome

* [x] MongoDB used for user storage
* [x] Passwords hashed securely
* [x] JWT tokens generated at login

---

Next → Phase 5: Protecting Routes with JWT 🔐
