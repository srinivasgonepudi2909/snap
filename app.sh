#!/bin/bash

# SecureDocs Complete Frontend Generator (Violet Theme)
# Creates folder structure first, then populates with code

set -e
PROJECT_NAME="secure-docs-frontend"

echo "🚀 Generating SecureDocs Frontend (Violet Theme)..."
echo "==================================================="

# Check if project exists
if [ -d "$PROJECT_NAME" ]; then
    echo "📁 Project '$PROJECT_NAME' already exists - updating files..."
    cd $PROJECT_NAME
else
    echo "📁 Creating new project: $PROJECT_NAME"
    mkdir -p $PROJECT_NAME
    cd $PROJECT_NAME
fi

# =============================================
# CREATE ALL FOLDERS FIRST
# =============================================
echo "📂 Creating/checking folder structure..."

# Create all directories
mkdir -p public
mkdir -p src/{components,hooks,context,utils,styles,assets,pages}
mkdir -p src/components/{common,auth,dashboard,landing}
mkdir -p src/assets/{images,fonts}
mkdir -p src/assets/images/icons

echo "✅ All folders created/verified"

# =============================================
# PACKAGE.JSON
# =============================================
echo "📦 Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "secure-docs-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "react-scripts": "5.0.1",
    "lucide-react": "^0.263.1",
    "react-dropzone": "^14.2.3",
    "js-cookie": "^3.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": ["react-app", "react-app/jest"]
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
EOF

# =============================================
# PUBLIC FILES
# =============================================
echo "🏠 Creating public files..."
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="SecureDocs - Secure Document Storage Platform" />
    <title>SecureDocs - Secure Document Storage</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

# =============================================
# MAIN REACT FILES
# =============================================
echo "⚛️ Creating main React files..."
cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
EOF

cat > src/App.js << 'EOF'
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FileProvider } from './context/FileContext';
import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <FileProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </FileProvider>
    </AuthProvider>
  );
}

export default App;
EOF

# =============================================
# CONTEXT FILES
# =============================================
echo "🌍 Creating context files..."
cat > src/context/AuthContext.js << 'EOF'
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: email
      };
      
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('userData', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return mockUser;
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const signup = async (userData) => {
    try {
      const newUser = {
        id: Date.now(),
        ...userData
      };
      
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('userData', JSON.stringify(newUser));
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return newUser;
    } catch (error) {
      throw new Error('Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
EOF

cat > src/context/FileContext.js << 'EOF'
import React, { createContext, useContext, useState } from 'react';

const FileContext = createContext();

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([
    { id: 1, name: 'Documents', color: 'blue' },
    { id: 2, name: 'Photos', color: 'green' },
    { id: 3, name: 'Certificates', color: 'purple' }
  ]);

  const uploadFile = (file) => {
    const newFile = {
      id: Date.now(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    };
    setFiles(prev => [...prev, newFile]);
    return newFile;
  };

  const deleteFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const createFolder = (name, color = 'blue') => {
    const newFolder = {
      id: Date.now(),
      name,
      color,
      createdAt: new Date().toISOString()
    };
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  };

  const value = {
    files,
    folders,
    uploadFile,
    deleteFile,
    createFolder
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};
EOF

# =============================================
# HOOKS
# =============================================
echo "🪝 Creating hooks..."
cat > src/hooks/useAuth.js << 'EOF'
import { useAuth as useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};
EOF

# =============================================
# PAGES
# =============================================
echo "📄 Creating all pages..."

cat > src/pages/Home.js << 'EOF'
import React from 'react';
import LandingPage from '../components/landing/LandingPage';

const Home = () => {
  return <LandingPage />;
};

export default Home;
EOF

cat > src/pages/About.js << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Award, Heart, ArrowRight, CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="px-6 py-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SecureDocs</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-white/80 hover:text-white transition-colors">Home</Link>
            <Link to="/how-it-works" className="text-white/80 hover:text-white transition-colors">How It Works</Link>
            <Link to="/contact" className="text-white/80 hover:text-white transition-colors">Contact</Link>
            <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SecureDocs</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We revolutionize how people store, organize, and access their important documents with security and simplicity.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-12">Meet Our Team</h2>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 max-w-2xl mx-auto border border-white/20">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl font-bold text-white">GS</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Gonepudi Srinivas</h3>
            <p className="text-lg text-blue-400 mb-4">Founder & Lead Developer</p>
            <p className="text-gray-300 mb-6">
              Passionate about creating secure applications that solve real-world problems. 
              Srinivas founded SecureDocs to help people organize their digital lives safely.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform"
            >
              Get in Touch
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
EOF

cat > src/pages/HowItWorks.js << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, UserPlus, FolderPlus, Upload, Smartphone, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up",
      description: "Create your secure account in just 30 seconds with your email address.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: FolderPlus,
      title: "Create Folders",
      description: "Organize your documents by creating custom folders for different categories.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Upload,
      title: "Upload Documents",
      description: "Drag and drop your valuable documents, photos, and certificates securely.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Smartphone,
      title: "Access Anywhere",
      description: "View and download your files from any device, anywhere in the world.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="px-6 py-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SecureDocs</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-white/80 hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="text-white/80 hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="text-white/80 hover:text-white transition-colors">Contact</Link>
            <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            How <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SecureDocs</span> Works
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            User signs up first, then logs into the app where they can create folders and upload valuable documents to access anywhere.
          </p>
          <Link 
            to="/signup" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-xl hover:scale-105 transition-transform"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Steps Section */}
      <div className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple 4-Step Process</h2>
            <p className="text-xl text-gray-300">Get up and running in minutes</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:scale-105 transition-transform">
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
EOF

cat > src/pages/Contact.js << 'EOF'
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Send, ArrowRight, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="px-6 py-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SecureDocs</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-white/80 hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="text-white/80 hover:text-white transition-colors">About</Link>
            <Link to="/how-it-works" className="text-white/80 hover:text-white transition-colors">How It Works</Link>
            <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get in <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions about SecureDocs? We're here to help you secure your digital life.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Author Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">GS</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Gonepudi Srinivas</h3>
              <p className="text-lg text-blue-400 mb-4">Founder & Lead Developer</p>
              <div className="flex items-center justify-center space-x-2 text-gray-300 mb-6">
                <Mail className="w-5 h-5" />
                <a href="mailto:srigonepudi@gmail.com" className="hover:text-blue-400 transition-colors">
                  srigonepudi@gmail.com
                </a>
              </div>
              <p className="text-gray-300 text-center">
                Passionate about creating secure applications. Contact me directly for any questions about SecureDocs!
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-8">Send us a Message</h2>
            
            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-lg flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-green-400 font-medium">Message sent successfully!</p>
                  <p className="text-green-300 text-sm">We'll get back to you within 24 hours.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Name"
                required
              />
              
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Email"
                required
              />

              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feature">Feature Request</option>
              </select>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Your Message"
                required
              ></textarea>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
              >
                Send Message
                <Send className="ml-2 w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
EOF

# Continue creating remaining files...
echo "🔐 Creating auth components..."

cat > src/components/auth/Login.js << 'EOF'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-300">Sign in to your SecureDocs account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
EOF

cat > src/components/auth/Signup.js << 'EOF'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await signup(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-300">Join SecureDocs today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full Name"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm Password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
EOF

cat > src/components/auth/ProtectedRoute.js << 'EOF'
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
EOF

cat > src/pages/Login.js << 'EOF'
import React from 'react';
import LoginComponent from '../components/auth/Login';

const Login = () => {
  return <LoginComponent />;
};

export default Login;
EOF

cat > src/pages/Signup.js << 'EOF'
import React from 'react';
import SignupComponent from '../components/auth/Signup';

const Signup = () => {
  return <SignupComponent />;
};

export default Signup;
EOF

cat > src/pages/Dashboard.js << 'EOF'
import React from 'react';
import DashboardComponent from '../components/dashboard/Dashboard';

const Dashboard = () => {
  return <DashboardComponent />;
};

export default Dashboard;
EOF

cat > src/pages/NotFound.js << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertCircle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
EOF

# =============================================
# LANDING PAGE COMPONENTS
# =============================================
echo "🏠 Creating landing page components..."

cat > src/components/landing/LandingPage.js << 'EOF'
import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from './Hero';
import Features from './Features';
import Benefits from './Benefits';
import CTA from './CTA';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SecureDocs</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-white/80 hover:text-white transition-colors font-medium">
              About Us
            </Link>
            <Link to="/how-it-works" className="text-white/80 hover:text-white transition-colors font-medium">
              How It Works
            </Link>
            <Link to="/contact" className="text-white/80 hover:text-white transition-colors font-medium">
              Contact
            </Link>
            <Link to="/login" className="px-6 py-2 text-white/80 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:scale-105 transition-transform">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <Hero />
      <Features />
      <Benefits />
      <CTA />
    </div>
  );
};

export default LandingPage;
EOF

cat > src/components/landing/Hero.js << 'EOF'
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="px-6 py-20">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-6xl font-bold mb-6 text-white">
          Your Digital Vault
          <span className="block text-5xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Secured & Organized
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Store, organize, and access your valuable documents, photos, and certificates with military-grade security. 
          Create custom folders and never lose important files again.
        </p>
        <Link to="/signup" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-xl hover:scale-105 transition-transform">
          Get Started Free
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default Hero;
EOF

cat > src/components/landing/Features.js << 'EOF'
import React from 'react';
import { Upload, Folder, Lock } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Drag and drop your documents, photos, and certificates. Support for all major file formats.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Folder,
      title: "Smart Organization",
      description: "Create custom folders and use intelligent search to find exactly what you need.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Lock,
      title: "Bank-Level Security",
      description: "End-to-end encryption and secure cloud storage keep your files safe.",
      color: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <div className="px-6 py-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:scale-105 transition-transform">
            <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
              <feature.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
EOF

cat > src/components/landing/Benefits.js << 'EOF'
import React from 'react';
import { CheckCircle, Star, Shield, Upload } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    { icon: CheckCircle, title: "99.9% Uptime", subtitle: "Always accessible", color: "from-blue-500 to-cyan-500" },
    { icon: Star, title: "5-Star Rated", subtitle: "Loved by users", color: "from-green-500 to-teal-500" },
    { icon: Shield, title: "Enterprise Security", subtitle: "Military-grade protection", color: "from-purple-500 to-violet-500" },
    { icon: Upload, title: "Unlimited Storage", subtitle: "Never worry about space", color: "from-orange-500 to-red-500" }
  ];

  return (
    <div className="px-6 py-10">
      <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-sm rounded-3xl p-12">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Why Choose SecureDocs?</h2>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {benefits.map((benefit, index) => (
            <div key={index}>
              <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{benefit.title}</h4>
              <p className="text-gray-400">{benefit.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Benefits;
EOF

cat > src/components/landing/CTA.js << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <div className="px-6 py-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Ready to Secure Your Documents?</h2>
        <p className="text-xl text-gray-300 mb-8">
          Join thousands who trust SecureDocs with their important files.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-xl hover:scale-105 transition-transform">
            Start Free Trial
          </Link>
          <button className="px-8 py-4 bg-white/10 text-white text-lg font-semibold rounded-xl hover:bg-white/20 transition-colors">
            Watch Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CTA;
EOF

# =============================================
# DASHBOARD COMPONENTS
# =============================================
echo "📊 Creating dashboard components..."

cat > src/components/dashboard/Dashboard.js << 'EOF'
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './Sidebar';
import FileUpload from './FileUpload';
import FileList from './FileList';
import { LogOut, User } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
              <p className="text-gray-600">Securely store and organize your files</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{user?.name || 'User'}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <FileUpload />
            <FileList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
EOF

cat > src/components/dashboard/Sidebar.js << 'EOF'
import React from 'react';
import { Shield, Home, Folder, Upload, Search, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">SecureDocs</span>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-600 text-white">
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
EOF

cat > src/components/dashboard/FileUpload.js << 'EOF'
import React from 'react';
import { Upload } from 'lucide-react';

const FileUpload = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Files</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>
        <p className="text-gray-700 font-medium">Drag & drop files here, or click to select</p>
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Choose Files
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
EOF

cat > src/components/dashboard/FileList.js << 'EOF'
import React from 'react';
import { Folder } from 'lucide-react';

const FileList = () => {
  const folders = [
    { id: 1, name: 'Documents', count: 8 },
    { id: 2, name: 'Photos', count: 15 },
    { id: 3, name: 'Certificates', count: 4 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Folders</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {folders.map((folder) => (
          <div key={folder.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center space-x-3">
              <Folder className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900">{folder.name}</h3>
                <p className="text-sm text-gray-500">{folder.count} files</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
EOF

# =============================================
# STYLES AND CONFIG
# =============================================
echo "🎨 Creating styles..."
cat > src/index.css << 'EOF'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
}
EOF

# =============================================
# DOCKER FILES
# =============================================
echo "🐳 Creating Docker files..."
cat > Dockerfile << 'EOF'
FROM node:18-alpine as build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

cat > .dockerignore << 'EOF'
node_modules
.git
README.md
.env*
EOF

cat > .gitignore << 'EOF'
node_modules/
build/
.env*
*.log
EOF

cat > README.md << 'EOF'
# SecureDocs Frontend (Violet Theme)

Beautiful violet-themed document storage platform.

## Author
**Gonepudi Srinivas**
Email: srigonepudi@gmail.com

## Quick Start
```bash
docker build -t secure-docs .
docker run -p 80:80 secure-docs
```

## Features
- Beautiful violet theme
- About Us, How It Works, Contact pages
- Authentication system
- File upload dashboard
EOF

echo ""
echo "🎉 COMPLETE VIOLET FRONTEND GENERATED!"
echo "====================================="
echo "📁 Project: $PROJECT_NAME"
echo "📄 Total files: $(find . -type f | wc -l)"
echo ""
echo "✨ Features:"
echo "   🎨 Beautiful violet/purple theme"
echo "   🏠 Landing page with navigation"
echo "   📄 About Us, How It Works, Contact pages"
echo "   🔐 Login/Signup with violet glassmorphism"
echo "   📊 Dashboard for file management"
echo "   🐳 Docker ready"
echo ""
echo "🚀 To deploy:"
echo "   cd $PROJECT_NAME"
echo "   docker build -t secure-docs ."
echo "   docker run -p 80:80 secure-docs"
echo ""
echo "🌐 Access at: http://localhost"
echo "👤 Author: Gonepudi Srinivas (srigonepudi@gmail.com)"
echo ""
echo "🎯 Your violet SecureDocs app is ready!"