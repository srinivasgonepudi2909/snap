cat > src/components/Home.jsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Folder, Shield, Check, Star, Lock, ArrowRight, X, Eye, EyeOff, ChevronDown, 
         FileText, Users, Award, Phone, Mail, MapPin, Calendar } from 'lucide-react';

const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState('login');
  const [selectedCountry, setSelectedCountry] = useState({ code: '+91', flag: '🇮🇳', name: 'India' });
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const countries = [
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+1', flag: '🇺🇸', name: 'United States' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+86', flag: '🇨🇳', name: 'China' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const SnapDocsLogo = () => (
    <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-300">
        <div className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
        <div className="text-white font-bold text-base z-10">SD</div>
        <div className="absolute bottom-1 right-1 w-4 h-2 bg-white rounded-sm opacity-80"></div>
      </div>
      <span className="text-2xl font-bold text-white group-hover:scale-110 transition-all duration-300">
        SnapDocs
      </span>
    </Link>
  );

  const Header = () => (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <SnapDocsLogo />
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/about"
              className="text-gray-300 hover:text-white transition-all duration-300 font-bold text-lg hover:scale-110 transform cursor-pointer"
            >
              About Us
            </Link>
            <Link 
              to="/how-it-works"
              className="text-gray-300 hover:text-white transition-all duration-300 font-bold text-lg hover:scale-110 transform cursor-pointer"
            >
              How It Works
            </Link>
            <Link 
              to="/contact"
              className="text-gray-300 hover:text-white transition-all duration-300 font-bold text-lg hover:scale-110 transform cursor-pointer"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setActiveModal('login');
                setIsLoginOpen(true);
              }}
              className={`font-bold text-lg transition-all duration-300 hover:scale-110 transform px-4 py-2 rounded-lg ${
                activeModal === 'login' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setActiveModal('signup');
                setIsSignupOpen(true);
              }}
              className={`font-bold text-lg transition-all duration-300 hover:scale-110 transform px-6 py-2 rounded-lg shadow-lg ${
                activeModal === 'signup' 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  // Login Modal Component
  const LoginModal = () => (
    isLoginOpen && (
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl border border-white/10 animate-scale-in">
          <button
            onClick={() => setIsLoginOpen(false)}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <SnapDocsLogo />
            <h2 className="text-3xl font-bold text-white mt-6 mb-2">Welcome Back</h2>
            <p className="text-gray-400">Login to access your digital vault</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Login to SnapDocs
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-400">Don't have an account? </span>
            <button
              onClick={() => {
                setIsLoginOpen(false);
                setIsSignupOpen(true);
                setActiveModal('signup');
              }}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Sign up here
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Signup Modal Component
  const SignupModal = () => (
    isSignupOpen && (
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl border border-white/10 animate-scale-in max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setIsSignupOpen(false)}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <SnapDocsLogo />
            <h2 className="text-3xl font-bold text-white mt-6 mb-2">Create Account</h2>
            <p className="text-gray-400">Join thousands securing their documents</p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Last name"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Phone Number</label>
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCountryOpen(!isCountryOpen)}
                    className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-colors"
                  >
                    <span>{selectedCountry.flag}</span>
                    <span>{selectedCountry.code}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {isCountryOpen && (
                    <div className="absolute top-full mt-1 left-0 bg-gray-800 rounded-xl border border-white/20 shadow-2xl z-10 w-64">
                      {countries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setIsCountryOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-white text-left"
                        >
                          <span>{country.flag}</span>
                          <span>{country.code}</span>
                          <span className="text-sm text-gray-400">{country.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="tel"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Phone number"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors pr-12"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Create SnapDocs Account
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-400">Already have an account? </span>
            <button
              onClick={() => {
                setIsSignupOpen(false);
                setIsLoginOpen(true);
                setActiveModal('login');
              }}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Login here
            </button>
          </div>
        </div>
      </div>
    )
  );

  const features = [
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Drag and drop your documents or browse to upload. Support for all file types including PDF, images, and office documents."
    },
    {
      icon: Folder,
      title: "Smart Organization",
      description: "Create custom folders for different document types. Organize by category, date, or any system that works for you."
    },
    {
      icon: Shield,
      title: "Military-Grade Security",
      description: "Your documents are encrypted with AES-256 encryption. Multi-factor authentication and secure cloud storage."
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      content: "SnapDocs has revolutionized how I manage my documents. Everything is organized and secure in one place.",
      rating: 5,
      avatar: "👩‍💻"
    },
    {
      name: "Raj Patel",
      role: "Business Owner",
      content: "The folder system is incredible. I can find any document in seconds. Perfect for my business needs.",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      name: "Dr. Ananya Kumar",
      role: "Medical Professional",
      content: "Security is paramount for medical documents. SnapDocs gives me peace of mind with their encryption.",
      rating: 5,
      avatar: "👩‍⚕️"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Header />
      <LoginModal />
      <SignupModal />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-8 max-w-4xl mx-auto pt-20 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight animate-slide-up">
                Your Digital Vault
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Secured & Organized
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-up">
                Store, organize, and access your valuable documents, photos, and certificates with 
                military-grade security. Create custom folders and never lose important files again.
              </p>
            </div>

            <div className="pt-4 animate-scale-in">
              <button
                onClick={() => {
                  setActiveModal('signup');
                  setIsSignupOpen(true);
                }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-110 transition-all duration-300 shadow-2xl"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">10K+</div>
                <div className="text-gray-400">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">50M+</div>
                <div className="text-gray-400">Documents Stored</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">99.9%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SnapDocs?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Powerful features designed to keep your documents safe, organized, and easily accessible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document Types Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Organize Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Digital Life</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Create custom folders for different types of documents and keep everything perfectly organized
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "📄", title: "ID Documents", desc: "Passport, License, Aadhar, PAN Card" },
              { icon: "🎓", title: "Certificates", desc: "Degrees, Courses, Awards, Diplomas" },
              { icon: "🏠", title: "Property Docs", desc: "Deeds, Insurance, Agreements" },
              { icon: "💼", title: "Business Files", desc: "Contracts, Invoices, Reports" },
              { icon: "🏥", title: "Medical Records", desc: "Reports, Prescriptions, Insurance" },
              { icon: "💰", title: "Financial", desc: "Bank Statements, Tax Records, Investments" },
              { icon: "✈️", title: "Travel", desc: "Tickets, Visas, Bookings, Itineraries" },
              { icon: "📱", title: "Personal", desc: "Photos, Notes, Memories, Receipts" }
            ].map((type, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{type.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{type.title}</h3>
                <p className="text-gray-400 text-sm">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Loved by <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Thousands</span>
            </h2>
            <p className="text-xl text-gray-400">See what our users say about SnapDocs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Secure Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Digital Vault?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust SnapDocs with their most important documents. 
              Start organizing your digital life today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setActiveModal('signup');
                  setIsSignupOpen(true);
                }}
                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/15 transition-all duration-300 border border-white/20"
              >
                <span>Learn More</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <SnapDocsLogo />
              <p className="text-gray-400 mt-4 max-w-md">
                Your trusted partner for secure document storage and organization. 
                Keep your digital life organized with military-grade security.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">About Us</Link>
                <Link to="/how-it-works" className="block text-gray-400 hover:text-white transition-colors">How It Works</Link>
                <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors">Contact</Link>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>srigonepudi@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>India 🇮🇳</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SnapDocs. All rights reserved. Made with ❤️ by Gonepudi Srinivas</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
