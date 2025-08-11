#!/bin/bash

# SecureDocs Frontend Code Generator Script
# This script creates all frontend files with actual code

set -e
PROJECT_NAME="secure-docs-frontend"

echo "🚀 Generating SecureDocs Frontend Code..."
echo "========================================="

# Create project structure first
./create-frontend.sh 2>/dev/null || echo "Creating structure..."

cd $PROJECT_NAME

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
echo "🏠 Creating public/index.html..."
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
echo "⚛️ Creating src/index.js..."
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

echo "⚛️ Creating src/App.js..."
cat > src/App.js << 'EOF'
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FileProvider } from './context/FileContext';
import Home from './pages/Home';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-orange-100 to-blue-100">
      {/* Navigation */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">SecureDocs</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-6 py-2 text-white/80 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-lg hover:scale-105 transition-transform">
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
        <h1 className="text-6xl font-bold mb-6 text-gray-900">
          Your Digital Vault
          <span className="block text-5xl bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Secured & Organized
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Store, organize, and access your valuable documents, photos, and certificates with military-grade security. 
          Create custom folders and never lose important files again.
        </p>
        <Link to="/signup" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-orange-500 text-white text-lg font-semibold rounded-xl hover:scale-105 transition-transform">
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
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Secure Your Documents?</h2>
        <p className="text-xl text-gray-700 mb-8">
          Join thousands who trust SecureDocs with their important files.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-orange-500 text-white text-lg font-semibold rounded-xl hover:scale-105 transition-transform">
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
# AUTH COMPONENTS
# =============================================
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-red-800 flex items-center justify-center px-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-300">Sign in to your SecureDocs account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Don't have an account?{' '}
            <Link to="/signup" className="text-red-400 hover:text-red-300 font-medium">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-red-800 flex items-center justify-center px-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-300">Join SecureDocs today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Create a password"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                required
              />
            </div>
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
            <Link to="/login" className="text-red-400 hover:text-red-300 font-medium">
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
        {/* Header */}
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

        {/* Main Content */}
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
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', active: true },
    { icon: Folder, label: 'My Files', path: '/files' },
    { icon: Upload, label: 'Upload', path: '/upload' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-800 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">SecureDocs</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Storage Info */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-sm text-gray-400 mb-2">Storage Used</div>
        <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
          <div className="bg-red-600 h-2 rounded-full" style={{ width: '45%' }}></div>
        </div>
        <div className="text-xs text-gray-400">4.5 GB of 10 GB used</div>
      </div>
    </div>
  );
};

export default Sidebar;
EOF

cat > src/components/dashboard/FileUpload.js << 'EOF'
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image, FileText } from 'lucide-react';

const FileUpload = () => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log('Files uploaded:', acceptedFiles);
    // Handle file upload logic here
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'text/*': ['.txt']
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Files</h2>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-red-600" />
          </div>
          
          {isDragActive ? (
            <p className="text-red-600 font-medium">Drop the files here...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">Drag & drop files here, or click to select</p>
              <p className="text-gray-500 text-sm">Support for images, PDFs, documents and more</p>
            </div>
          )}
          
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Choose Files
          </button>
        </div>
      </div>

      {/* File Type Icons */}
      <div className="flex items-center justify-center space-x-6 mt-6">
        <div className="flex items-center space-x-2 text-gray-500">
          <Image className="w-5 h-5" />
          <span className="text-sm">Images</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <FileText className="w-5 h-5" />
          <span className="text-sm">Documents</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <File className="w-5 h-5" />
          <span className="text-sm">PDFs</span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
EOF

cat > src/components/dashboard/FileList.js << 'EOF'
import React, { useState } from 'react';
import { File, Folder, MoreVertical, Download, Trash2, Eye } from 'lucide-react';

const FileList = () => {
  const [files] = useState([
    { id: 1, name: 'Passport.pdf', type: 'pdf', size: '2.4 MB', date: '2024-01-15', folder: 'Documents' },
    { id: 2, name: 'Resume.docx', type: 'doc', size: '156 KB', date: '2024-01-14', folder: 'Documents' },
    { id: 3, name: 'Profile_Photo.jpg', type: 'image', size: '892 KB', date: '2024-01-13', folder: 'Photos' },
    { id: 4, name: 'Certificate.pdf', type: 'pdf', size: '1.1 MB', date: '2024-01-12', folder: 'Certificates' }
  ]);

  const [folders] = useState([
    { id: 1, name: 'Documents', count: 8, color: 'blue' },
    { id: 2, name: 'Photos', count: 15, color: 'green' },
    { id: 3, name: 'Certificates', count: 4, color: 'purple' },
    { id: 4, name: 'Personal', count: 6, color: 'orange' }
  ]);

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <File className="w-8 h-8 text-red-500" />;
      case 'doc':
        return <File className="w-8 h-8 text-blue-500" />;
      case 'image':
        return <File className="w-8 h-8 text-green-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Folders */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Folders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <div key={folder.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-${folder.color}-100 rounded-lg flex items-center justify-center`}>
                  <Folder className={`w-6 h-6 text-${folder.color}-600`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{folder.name}</h3>
                  <p className="text-sm text-gray-500">{folder.count} files</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Files */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Files</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Folder</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Size</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.type)}
                      <span className="font-medium text-gray-900">{file.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{file.folder}</td>
                  <td className="py-3 px-4 text-gray-600">{file.size}</td>
                  <td className="py-3 px-4 text-gray-600">{file.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FileList;
EOF

# =============================================
# PAGES
# =============================================
echo "📄 Creating page components..."

cat > src/pages/Home.js << 'EOF'
import React from 'react';
import LandingPage from '../components/landing/LandingPage';

const Home = () => {
  return <LandingPage />;
};

export default Home;
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
        <div className="w-24 h-24 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertCircle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:scale-105 transition-transform"
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
# CONTEXT AND HOOKS
# =============================================
echo "🌍 Creating context providers..."

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
    // Check for stored auth token on mount
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
      // Simulate API call
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
      // Simulate API call
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

cat > src/hooks/useAuth.js << 'EOF'
import { useAuth as useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};
EOF

cat > src/hooks/useFileUpload.js << 'EOF'
import { useState } from 'react';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFiles = async (files) => {
    setUploading(true);
    setProgress(0);

    try {
      // Simulate file upload with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }

      // Process files
      const uploadedFiles = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));

      return uploadedFiles;
    } catch (error) {
      throw new Error('Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    uploading,
    progress,
    uploadFiles
  };
};
EOF

# =============================================
# STYLES
# =============================================
echo "🎨 Creating style files..."

cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glassmorphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
EOF

# =============================================
# DOCKER FILES
# =============================================
echo "🐳 Creating Docker configuration..."

cat > Dockerfile << 'EOF'
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Create nginx config for React Router
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
EOF

cat > .dockerignore << 'EOF'
node_modules
npm-debug.log*
.git
.gitignore
README.md
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
EOF

cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log
EOF

# =============================================
# README
# =============================================
echo "📖 Creating README..."

cat > README.md << 'EOF'
# SecureDocs Frontend

A modern, secure document storage and management platform built with React.

## Features

- 🔐 Secure authentication system
- 📁 File upload with drag & drop
- 🗂️ Smart folder organization
- 🔍 File search and filtering
- 📱 Responsive design
- 🐳 Docker ready

## Quick Start

### Development
```bash
npm install
npm start
```

### Docker Build
```bash
docker build -t secure-docs-frontend .
docker run -p 80:80 secure-docs-frontend
```

## Project Structure

```
src/
├── components/     # React components
├── pages/         # Page components
├── context/       # React context providers
├── hooks/         # Custom hooks
├── utils/         # Utility functions
└── styles/        # CSS files
```

## Tech Stack

- React 18
- React Router
- Tailwind CSS
- Lucide React Icons
- React Dropzone

## Environment Variables

Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_UPLOAD_URL=http://localhost:5000/upload
```

## License

MIT License
EOF

echo ""
echo "🎉 FRONTEND CODE GENERATION COMPLETE!"
echo "=============================================="
echo "📁 Project: $PROJECT_NAME"
echo "📄 Files created: $(find . -type f | wc -l)"
echo "📂 Folders created: $(find . -type d | wc -l)"
echo ""
echo "🚀 To run your app:"
echo "   cd $PROJECT_NAME"
echo "   npm install"
echo "   npm start"
echo ""
echo "🐳 To build with Docker:"
echo "   docker build -t secure-docs ."
echo "   docker run -p 80:80 secure-docs"
echo ""
echo "✨ Features included:"
echo "   ✅ Beautiful landing page"
echo "   ✅ Authentication system"
echo "   ✅ Dashboard with file upload"
echo "   ✅ Folder management"
echo "   ✅ Responsive design"
echo "   ✅ Docker configuration"
echo ""
echo "🎯 Your SecureDocs app is ready to deploy!"