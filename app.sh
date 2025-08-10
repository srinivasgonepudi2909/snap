#!/bin/bash

# Project root folder
ROOT_DIR="snap"

echo "🚀 Setting up React project structure with Docker support..."

# Create folder structure
mkdir -p $ROOT_DIR/src/{assets/styles,components/common,pages/{HomePage,AboutPage},hooks,utils,services,context,routes}

# --- Create and populate files if they don't exist ---

# index.js
cat > $ROOT_DIR/src/index.js <<'EOF'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/styles/global.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
EOF

# App.js
cat > $ROOT_DIR/src/App.js <<'EOF'
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import Header from "./components/common/Header";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
EOF

# Header.js
cat > $ROOT_DIR/src/components/common/Header.js <<'EOF'
import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header style={{ background: "#111", color: "#fff", padding: "1rem" }}>
    <nav>
      <Link to="/" style={{ color: "#fff", marginRight: "1rem" }}>Home</Link>
      <Link to="/about" style={{ color: "#fff" }}>About</Link>
    </nav>
  </header>
);

export default Header;
EOF

# HomePage.js
cat > $ROOT_DIR/src/pages/HomePage/HomePage.js <<'EOF'
import React from "react";

const HomePage = () => (
  <div style={{ padding: "2rem" }}>
    <h1>Welcome to My React App</h1>
    <p>This is the Home page.</p>
  </div>
);

export default HomePage;
EOF

# AboutPage.js
cat > $ROOT_DIR/src/pages/AboutPage/AboutPage.js <<'EOF'
import React from "react";

const AboutPage = () => (
  <div style={{ padding: "2rem" }}>
    <h1>About</h1>
    <p>This is the About page.</p>
  </div>
);

export default AboutPage;
EOF

# global.css
cat > $ROOT_DIR/src/assets/styles/global.css <<'EOF'
body {
  margin: 0;
  font-family: 'Segoe UI', Arial, sans-serif;
  background-color: #f9f9f9;
}
EOF

# public/index.html
mkdir -p $ROOT_DIR/public
cat > $ROOT_DIR/public/index.html <<'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
EOF

# Dockerfile
cat > $ROOT_DIR/Dockerfile <<'EOF'
# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# ---- Nginx Serve Stage ----
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# .dockerignore
cat > $ROOT_DIR/.dockerignore <<'EOF'
node_modules
build
.dockerignore
Dockerfile
npm-debug.log
EOF

# gitignore
cat > $ROOT_DIR/.gitignore <<'EOF'
node_modules
build
.env
.DS_Store
EOF

# package.json placeholder (user will run npm init or create-react-app)
cat > $ROOT_DIR/package.json <<'EOF'
{
  "name": "my-react-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^7.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
EOF

echo "✅ React project with Docker setup created at $ROOT_DIR"
echo "Next steps:"
echo "  cd $ROOT_DIR"
echo "  npm install"
echo "  npm start    # to run locally"
echo "  docker build -t my-react-app . && docker run -p 8080:80 my-react-app"
