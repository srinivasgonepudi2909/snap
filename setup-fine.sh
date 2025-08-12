className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-[1.02] focus:scale-[1.02]"
            placeholder="John"
          />
        </div>
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">Last Name</div>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-[1.02] focus:scale-[1.02]"
            placeholder="Doe"
          />
        </div>
      </div>
      
      <div>
        <div className="block text-sm font-medium text-gray-700 mb-1">Email</div>
        <input
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-[1.02] focus:scale-[1.02]"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <div className="block text-sm font-medium text-gray-700 mb-1">Phone Number</div>
        <div className="flex">
          <CountrySelector />
          <input
            type="tel"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-[1.02] focus:scale-[1.02]"
            placeholder="9876543210"
          />
        </div>
      </div>

      <div>
        <div className="block text-sm font-medium text-gray-700 mb-1">Password</div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 hover:scale-[1.02] focus:scale-[1.02]"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:scale-110 transition-all duration-200"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="button"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
      >
        Create Account
      </button>
      
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => {
            setIsSignupOpen(false);
            setActiveModal('login');
            setIsLoginOpen(true);
          }}
          className="text-blue-600 hover:text-blue-700 font-medium hover:scale-110 transition-all duration-200 inline-block transform"
        >
          Sign in
        </button>
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <WhyChooseSection />
      <CTASection />

      {/* Login Modal */}
      <Modal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        title="Welcome Back"
      >
        <LoginForm />
      </Modal>

      {/* Signup Modal */}
      <Modal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        title="Join SnapDocs"
      >
        <SignupForm />
      </Modal>
    </div>
  );
};

export default Home;
EOF

# Create About Us page
echo -e "${BLUE}📖 Creating AboutUs component...${NC}"
cat > src/components/AboutUs.jsx << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Zap, Users, Award, Globe, Lock, CheckCircle, User } from 'lucide-react';

const AboutUs = () => {
  const ProfileImage = () => (
    <div className="w-32 h-32 mx-auto mb-6 relative">
      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
            <User className="w-16 h-16 text-gray-600" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-300">
                <div className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
                <div className="text-white font-bold text-base z-10">SD</div>
                <div className="absolute bottom-1 right-1 w-4 h-2 bg-white rounded-sm opacity-80"></div>
              </div>
              <span className="text-2xl font-bold text-white group-hover:scale-110 transition-all duration-300">
                SnapDocs
              </span>
            </Link>
            
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-300 hover:text-white font-bold transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <ProfileImage />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-slide-up">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Gonepudi Srinivas</span>
            </h1>
            <p className="text-2xl text-blue-400 font-semibold mb-2 animate-slide-up">Founder & CEO, SnapDocs</p>
            <p className="text-lg text-gray-400 mb-6 animate-slide-up">29 years old • Tech Entrepreneur • Document Security Expert</p>
            <div className="flex items-center justify-center space-x-6 text-gray-400 animate-scale-in">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span>Based in India 🇮🇳</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-400" />
                <span>Usually responds within 24 hours</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12 animate-slide-up">
              Professional <span className="text-purple-400">Background</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {achievements.map((achievement, index) => (
                <div 
                  key={achievement.title}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center hover:scale-105 transition-all duration-300 animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <achievement.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{achievement.title}</h3>
                  <p className="text-gray-300">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Methods */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white text-center mb-4 animate-slide-up">
              Get in <span className="text-blue-400">Touch</span>
            </h2>
            <p className="text-xl text-gray-300 text-center mb-12 animate-slide-up">
              Have questions about SnapDocs? Need help with your account? I'm here to help!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {contactMethods.map((method, index) => (
                <a
                  key={method.title}
                  href={method.link}
                  className="block bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:scale-105 transition-all duration-300 group animate-scale-in"
                  style={{animationDelay: `${index * 0.15}s`}}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300`}>
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 text-center">{method.title}</h3>
                  <p className="text-blue-400 font-semibold text-center mb-3">{method.value}</p>
                  <p className="text-gray-300 text-sm text-center">{method.description}</p>
                </a>
              ))}
            </div>

            {/* Direct Contact Card */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-8 border border-white/20 animate-fade-in">
              <div className="text-center">
                <Mail className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Primary Contact</h3>
                <a 
                  href="mailto:srigonepudi@gmail.com"
                  className="text-xl text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline"
                >
                  srigonepudi@gmail.com
                </a>
                <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
                  For all inquiries including support, partnerships, feedback, or general questions about SnapDocs. 
                  I personally read and respond to every email.
                </p>
              </div>
            </div>
          </div>

          {/* What I Can Help With */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12 animate-slide-up">
              What I Can <span className="text-green-400">Help With</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "🔧 Technical Support", desc: "Account issues, upload problems, or feature questions" },
                { title: "🤝 Business Partnerships", desc: "Integration opportunities and enterprise solutions" },
                { title: "💡 Feature Requests", desc: "Suggestions for new features and improvements" },
                { title: "🔐 Security Concerns", desc: "Questions about data protection and privacy" },
                { title: "📈 Enterprise Solutions", desc: "Custom solutions for large organizations" },
                { title: "🎓 Educational Discounts", desc: "Special pricing for students and educators" }
              ].map((item, index) => (
                <div 
                  key={item.title}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Message */}
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 animate-scale-in">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-6">A Personal Message</h2>
              <div className="text-lg text-gray-300 leading-relaxed space-y-4">
                <p>
                  Thank you for choosing SnapDocs! As the founder, I'm personally committed to making sure 
                  your experience with our platform exceeds your expectations.
                </p>
                <p>
                  Whether you're securing family documents, organizing business files, or managing important 
                  certificates, I understand how crucial it is to have a reliable, secure solution you can trust.
                </p>
                <p>
                  Don't hesitate to reach out with any questions, suggestions, or feedback. Your input directly 
                  shapes the future of SnapDocs, and I read every message personally.
                </p>
                <div className="pt-6">
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-4"></div>
                  <p className="text-xl font-semibold text-blue-400">
                    Best regards,<br />
                    Gonepudi Srinivas
                  </p>
                  <p className="text-gray-400 mt-2">Founder & CEO, SnapDocs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
EOF

# Create .dockerignore
echo -e "${BLUE}🚫 Creating .dockerignore...${NC}"
cat > .dockerignore << 'EOF'
node_modules
npm-debug.log
build
.git
.gitignore
README.md
.env
coverage
.DS_Store
*.log
.nyc_output
EOF

# Build and deploy
echo -e "${BLUE}🔨 Building Docker image...${NC}"
docker build --no-cache -t $IMAGE_NAME:$IMAGE_VERSION . || {
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
}

echo -e "${BLUE}🚀 Starting container...${NC}"
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p $PORT:80 \
    $IMAGE_NAME:$IMAGE_VERSION || {
    echo -e "${RED}❌ Failed to start container!${NC}"
    exit 1
}

echo -e "${BLUE}✅ Verifying deployment...${NC}"
sleep 5

if docker ps | grep -q $CONTAINER_NAME; then
    echo ""
    echo -e "${GREEN}🎉 SUCCESS! Enhanced SnapDocs Pages are Live!${NC}"
    echo ""
    echo -e "${PURPLE}════════════════════════════════════════${NC}"
    echo -e "${PURPLE}   🌟 ENHANCED PAGES DEPLOYED 🌟       ${NC}"
    echo -e "${PURPLE}════════════════════════════════════════${NC}"
    echo ""
    echo -e "${GREEN}🌐 Access URLs:${NC}"
    echo -e "   🏠 Home: ${YELLOW}http://localhost:$PORT${NC}"
    echo -e "   📖 About Us: ${YELLOW}http://localhost:$PORT/about${NC}"
    echo -e "   ⚙️  How It Works: ${YELLOW}http://localhost:$PORT/how-it-works${NC}"
    echo -e "   📞 Contact: ${YELLOW}http://localhost:$PORT/contact${NC}"
    
    # Try to get network IP
    NETWORK_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "YOUR_SERVER_IP")
    echo -e "   🌍 Network: ${YELLOW}http://$NETWORK_IP:$PORT${NC}"
    echo ""
    echo -e "${BLUE}📊 Container Status:${NC}"
    docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    echo -e "${GREEN}✨ Enhanced Features:${NC}"
    echo -e "   🎨 Beautiful separate pages with proper backgrounds"
    echo -e "   🔄 React Router for smooth navigation"
    echo -e "   💫 Smooth animations and transitions"
    echo -e "   📱 Fully responsive design"
    echo -e "   🎭 Professional About Us page with company story"
    echo -e "   ⚙️  Detailed How It Works with big icons and explanations"
    echo -e "   👨‍💼 Professional Contact page: Gonepudi Srinivas"
    echo -e "   📧 Email: srigonepudi@gmail.com"
    echo -e "   🇮🇳 29-year-old tech entrepreneur from India"
    echo -e "   🚀 Enhanced folder organization examples"
    echo -e "   🔐 Security features showcase"
    echo -e "   📞 Multiple contact methods"
    
else
    echo -e "${RED}❌ Container failed to start!${NC}"
    echo -e "${RED}📋 Logs:${NC}"
    docker logs $CONTAINER_NAME 2>/dev/null || true
    exit 1
fi

echo -e "${BLUE}🧹 Cleaning up unused resources...${NC}"
docker image prune -f 2>/dev/null || true
docker container prune -f 2>/dev/null || true

echo ""
echo -e "${GREEN}🎉 ENHANCED PAGES DEPLOYMENT COMPLETED!${NC}"
echo ""
echo -e "${BLUE}💡 Navigation:${NC}"
echo -e "   🏠 Click 'About Us' → Opens ${YELLOW}/about${NC} page"
echo -e "   ⚙️  Click 'How It Works' → Opens ${YELLOW}/how-it-works${NC} page"
echo -e "   📞 Click 'Contact' → Opens ${YELLOW}/contact${NC} page"
echo -e "   🔙 Each page has 'Back to Home' button"
echo ""
echo -e "${PURPLE}Perfect! No more modal popups - clean separate pages! 🎊${NC} shadow-lg group-hover:scale-110 transition-all duration-300">
                <div className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
                <div className="text-white font-bold text-base z-10">SD</div>
                <div className="absolute bottom-1 right-1 w-4 h-2 bg-white rounded-sm opacity-80"></div>
              </div>
              <span className="text-2xl font-bold text-white group-hover:scale-110 transition-all duration-300">
                SnapDocs
              </span>
            </Link>
            
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-300 hover:text-white font-bold transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <ProfileImage />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
              About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SnapDocs</span>
            </h1>
            <p className="text-xl text-blue-400 font-semibold mb-4 animate-slide-up">
              Your Trusted Digital Document Partner
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full animate-scale-in"></div>
          </div>

          {/* Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="space-y-6 animate-slide-up">
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                At SnapDocs, we believe that your important documents deserve the highest level of security and organization. 
                Founded with the vision of simplifying digital document management, we've created a platform that combines 
                cutting-edge security with intuitive design.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our mission is to provide individuals and businesses with a secure, reliable, and accessible way to store, 
                organize, and manage their most valuable documents. From personal certificates and ID documents to business 
                contracts and property papers, SnapDocs ensures your files are always safe and within reach.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 animate-scale-in">
              <h3 className="text-2xl font-bold text-white mb-6">Why We're Different</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Military-grade encryption for maximum security</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Lightning-fast access and intuitive organization</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">99.9% uptime guarantee with global accessibility</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">Trusted by thousands of users worldwide</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-white text-center mb-12 animate-slide-up">
              What Makes Us <span className="text-blue-400">Special</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center hover:scale-105 transition-all duration-300 animate-fade-in">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Bank-Level Security</h3>
                <p className="text-gray-300">Your documents are protected with end-to-end encryption and secure cloud infrastructure.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center hover:scale-105 transition-all duration-300 animate-fade-in">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Award-Winning Design</h3>
                <p className="text-gray-300">Beautiful, intuitive interface that makes document management a pleasure, not a chore.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center hover:scale-105 transition-all duration-300 animate-fade-in">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Proven Reliability</h3>
                <p className="text-gray-300">99.9% uptime ensures your documents are always accessible when you need them most.</p>
              </div>
            </div>
          </div>

          {/* Vision Section */}
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 animate-scale-in">
            <h2 className="text-4xl font-bold text-white mb-6">Our Vision</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Whether you're storing academic certificates, property documents, insurance papers, or business contracts, 
              SnapDocs provides the perfect solution for modern document management needs. We envision a world where 
              important documents are never lost, always secure, and instantly accessible from anywhere.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;
EOF

# Create How It Works page
echo -e "${BLUE}⚙️ Creating HowItWorks component...${NC}"
cat > src/components/HowItWorks.jsx << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, FolderPlus, Upload, Smartphone, Shield, Zap, Globe, CheckCircle, Folder } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up with your email and create a secure SnapDocs account with two-factor authentication.",
      icon: UserPlus,
      color: "from-blue-500 to-blue-600",
      details: [
        "Email verification for security",
        "Strong password requirements",
        "Two-factor authentication setup",
        "Welcome tour and onboarding"
      ]
    },
    {
      number: "02",
      title: "Create Custom Folders",
      description: "Organize your digital life with intelligent folder categories tailored to your needs.",
      icon: FolderPlus,
      color: "from-purple-500 to-purple-600",
      details: [
        "📄 ID Documents (Passport, License, etc.)",
        "🎓 Study Certificates (Degrees, Courses)",
        "🏠 Property Documents (Deeds, Insurance)",
        "💼 Business Files (Contracts, Invoices)"
      ]
    },
    {
      number: "03",
      title: "Upload Your Documents",
      description: "Drag, drop, and upload any file type with our advanced processing engine.",
      icon: Upload,
      color: "from-green-500 to-green-600",
      details: [
        "Support for all file formats",
        "Automatic file optimization",
        "OCR text recognition",
        "Smart tagging and categorization"
      ]
    },
    {
      number: "04",
      title: "Access Anywhere",
      description: "Your documents sync across all devices with real-time updates and offline access.",
      icon: Smartphone,
      color: "from-orange-500 to-orange-600",
      details: [
        "Cross-platform synchronization",
        "Mobile apps for iOS and Android",
        "Offline access capabilities",
        "Real-time collaboration features"
      ]
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "Military-grade AES-256 encryption protects your files during transfer and storage."
    },
    {
      icon: Zap,
      title: "Lightning Fast Search",
      description: "Find any document instantly with our AI-powered search across all your files."
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Access your documents from anywhere in the world with 99.9% uptime guarantee."
    },
    {
      icon: CheckCircle,
      title: "Version Control",
      description: "Keep track of document changes with automatic versioning and history."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-300">
                <div className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
                <div className="text-white font-bold text-base z-10">SD</div>
                <div className="absolute bottom-1 right-1 w-4 h-2 bg-white rounded-sm opacity-80"></div>
              </div>
              <span className="text-2xl font-bold text-white group-hover:scale-110 transition-all duration-300">
                SnapDocs
              </span>
            </Link>
            
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-300 hover:text-white font-bold transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
              How <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SnapDocs</span> Works
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 animate-slide-up">
              Simple, secure, and powerful document management in four easy steps
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full animate-scale-in"></div>
          </div>

          {/* Steps Section */}
          <div className="mb-20">
            <div className="space-y-16">
              {steps.map((step, index) => (
                <div 
                  key={step.number}
                  className={`flex flex-col lg:flex-row items-center gap-12 ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  } animate-slide-up`}
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                        {step.number}
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white">{step.title}</h2>
                    </div>
                    <p className="text-xl text-gray-300 leading-relaxed">{step.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className={`w-3 h-3 bg-gradient-to-r ${step.color} rounded-full`}></div>
                          <span className="text-gray-400">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 flex justify-center">
                    <div className={`w-64 h-64 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300`}>
                      <step.icon className="w-32 h-32 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Folder Examples */}
          <div className="mb-20 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Smart <span className="text-purple-400">Organization</span>
              </h2>
              <p className="text-xl text-gray-300">Create folders that match your life and work</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "📄 ID Documents", color: "from-blue-500 to-blue-600", count: "12 files" },
                { name: "🎓 Study Certificates", color: "from-green-500 to-green-600", count: "8 files" },
                { name: "🏠 Property Documents", color: "from-orange-500 to-orange-600", count: "15 files" },
                { name: "💼 Business Files", color: "from-purple-500 to-purple-600", count: "23 files" }
              ].map((folder, index) => (
                <div 
                  key={folder.name}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 text-center animate-scale-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${folder.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Folder className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{folder.name}</h3>
                  <p className="text-gray-400 text-sm">{folder.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security Features */}
          <div className="mb-20">
            <div className="text-center mb-12 animate-slide-up">
              <h2 className="text-4xl font-bold text-white mb-4">
                Advanced <span className="text-green-400">Security</span>
              </h2>
              <p className="text-xl text-gray-300">Enterprise-grade protection for your valuable documents</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:scale-105 transition-all duration-300 animate-fade-in"
                  style={{animationDelay: `${index * 0.15}s`}}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-12 border border-white/20 animate-scale-in">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust SnapDocs with their most important documents
            </p>
            <Link 
              to="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-110 transition-all duration-300 shadow-2xl"
            >
              <span>Start Free Trial</span>
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
EOF

# Create Contact page
echo -e "${BLUE}📞 Creating Contact component...${NC}"
cat > src/components/Contact.jsx << 'EOF'
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, User, MapPin, Clock, MessageCircle, Phone, Globe, Award, Shield } from 'lucide-react';

const Contact = () => {
  const ProfileImage = () => (
    <div className="w-40 h-40 mx-auto mb-8 relative">
      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
            <User className="w-20 h-20 text-gray-600" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 right-3 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
        <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
      </div>
    </div>
  );

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "srigonepudi@gmail.com",
      description: "Best for detailed inquiries and support requests",
      color: "from-blue-500 to-blue-600",
      link: "mailto:srigonepudi@gmail.com"
    },
    {
      icon: MessageCircle,
      title: "Chat Support",
      value: "Live Chat Available",
      description: "Quick responses during business hours",
      color: "from-green-500 to-green-600",
      link: "mailto:srigonepudi@gmail.com"
    },
    {
      icon: Phone,
      title: "Business Inquiries",
      value: "Partnerships & Sales",
      description: "For enterprise solutions and partnerships",
      color: "from-purple-500 to-purple-600",
      link: "mailto:srigonepudi@gmail.com"
    }
  ];

  const achievements = [
    {
      icon: Award,
      title: "Tech Entrepreneur",
      description: "Building innovative solutions for document management"
    },
    {
      icon: Shield,
      title: "Security Expert",
      description: "Specialized in digital document security and encryption"
    },
    {
      icon: Globe,
      title: "Global Vision",
      description: "Serving users worldwide with 99.9% uptime"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden#!/bin/bash

# SnapDocs Enhanced Pages Deployment
# Creates separate beautiful pages for About Us, How It Works, and Contact
# with proper backgrounds, animations, and professional designs

set -e

echo "🚀 SnapDocs Enhanced Pages Deployment"
echo "======================================"
echo "📋 Features: Separate Pages, Beautiful Backgrounds, Smooth Transitions"
echo ""

# Configuration
IMAGE_NAME="snapdocs-app"
IMAGE_VERSION="latest"
CONTAINER_NAME="snapdocs-container"
PORT="3000"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Stop existing container
echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true
docker rmi $IMAGE_NAME:$IMAGE_VERSION 2>/dev/null || true

# Create Dockerfile
echo -e "${BLUE}🐳 Creating Dockerfile...${NC}"
cat > Dockerfile << 'EOF'
FROM node:18-alpine as build
WORKDIR /app
COPY package.json ./
RUN npm install --silent
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Create nginx.conf
echo -e "${BLUE}🌐 Creating nginx.conf...${NC}"
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, max-age=31536000";
        }
    }
}
EOF

# Create package.json
echo -e "${BLUE}📦 Creating package.json...${NC}"
cat > package.json << 'EOF'
{
  "name": "snapdocs-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "react-router-dom": "^6.8.0",
    "lucide-react": "^0.263.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
EOF

# Create public/index.html
echo -e "${BLUE}📄 Creating public/index.html...${NC}"
mkdir -p public
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="SnapDocs - Your Digital Vault Secured & Organized. Store, organize, and access your valuable documents with military-grade security." />
    <title>SnapDocs - Your Digital Vault Secured & Organized</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            animation: {
              'fade-in': 'fadeIn 0.8s ease-out',
              'slide-up': 'slideUp 0.6s ease-out',
              'scale-in': 'scaleIn 0.5s ease-out',
              'bounce-slow': 'bounce 2s infinite'
            },
            keyframes: {
              fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' }
              },
              slideUp: {
                '0%': { opacity: '0', transform: 'translateY(30px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' }
              },
              scaleIn: {
                '0%': { opacity: '0', transform: 'scale(0.95)' },
                '100%': { opacity: '1', transform: 'scale(1)' }
              }
            }
          }
        }
      }
    </script>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📄</text></svg>">
  </head>
  <body>
    <noscript>You need to enable JavaScript to run SnapDocs application.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

# Create src/index.js
echo -e "${BLUE}📄 Creating src/index.js...${NC}"
mkdir -p src
cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
EOF

# Create src/index.css
echo -e "${BLUE}🎨 Creating src/index.css...${NC}"
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #1f2937 0%, #7c3aed 50%, #8b5cf6 100%);
  min-height: 100vh;
}

html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Page transitions */
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 600ms ease-out;
}

.page-exit {
  opacity: 1;
  transform: translateY(0);
}

.page-exit-active {
  opacity: 0;
  transform: translateY(-20px);
  transition: all 400ms ease-in;
}
EOF

# Create main App.jsx with routing
echo -e "${BLUE}⚛️ Creating App.jsx with routing...${NC}"
cat > src/App.jsx << 'EOF'
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import HowItWorks from './components/HowItWorks';
import Contact from './components/Contact';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default App;
EOF

# Create components directory
echo -e "${BLUE}📁 Creating components...${NC}"
mkdir -p src/components

# Create Home component
echo -e "${BLUE}🏠 Creating Home component...${NC}"
cat > src/components/Home.jsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Folder, Shield, Check, Star, Lock, ArrowRight, X, Eye, EyeOff, ChevronDown } from 'lucide-react';

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

  // SnapDocs Logo Component
  const SnapDocsLogo = () => {
    return (
      <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-300">
          <div className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
          <div className="text-white font-bold text-base z-10">SD</div>
          <div className="absolute bottom-1 right-1 w-4 h-2 bg-white rounded-sm opacity-80"></div>
          <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-blue-600 rounded-sm"></div>
          <div className="absolute bottom-0.5 right-1 w-4 h-0.5 bg-blue-600 rounded-sm"></div>
        </div>
        <span className="text-2xl font-bold text-white group-hover:scale-110 transition-all duration-300">
          SnapDocs
        </span>
      </Link>
    );
  };

  // Header Component
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

  // Hero Section
  const HeroSection = () => (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative">
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
        </div>
      </div>
    </section>
  );

  // Features Section
  const FeaturesSection = () => (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group hover:scale-105 animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Easy Upload</h3>
            <p className="text-gray-300 leading-relaxed">
              Drag and drop your documents, photos, and certificates. Support for all file types with instant upload processing.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 group hover:scale-105 animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Folder className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Smart Organization</h3>
            <p className="text-gray-300 leading-relaxed">
              Create custom folders and use intelligent search to find your documents instantly. Never lose track of important files.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group hover:scale-105 animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Bank-Level Security</h3>
            <p className="text-gray-300 leading-relaxed">
              End-to-end encryption and secure cloud storage. Your sensitive documents are protected with military-grade security.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  // Why Choose Section
  const WhyChooseSection = () => (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 animate-slide-up">
          Why Choose SnapDocs?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          <div className="text-center group cursor-pointer hover:scale-110 transition-all duration-300 animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">99.9% Uptime</h3>
            <p className="text-gray-400">Always accessible</p>
          </div>

          <div className="text-center group cursor-pointer hover:scale-110 transition-all duration-300 animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">5-Star Rated</h3>
            <p className="text-gray-400">Loved by users</p>
          </div>

          <div className="text-center group cursor-pointer hover:scale-110 transition-all duration-300 animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Enterprise Security</h3>
            <p className="text-gray-400">Military-grade protection</p>
          </div>

          <div className="text-center group cursor-pointer hover:scale-110 transition-all duration-300 animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Unlimited Storage</h3>
            <p className="text-gray-400">Never worry about space</p>
          </div>
        </div>
      </div>
    </section>
  );

  // CTA Section
  const CTASection = () => (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Secure Your Documents?
        </h2>
        <p className="text-xl text-gray-300 mb-12">
          Join thousands who trust SnapDocs with their important files.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => {
              setActiveModal('signup');
              setIsSignupOpen(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-110 transition-all duration-300 shadow-2xl"
          >
            Start Free Trial
          </button>
          <button className="bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-700 transform hover:scale-110 transition-all duration-300">
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className={`bg-white rounded-2xl ${maxWidth} w-full p-6 transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto animate-scale-in`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors hover:scale-110 transform duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  // Country Selector Component
  const CountrySelector = () => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsCountryOpen(!isCountryOpen)}
        className="flex items-center space-x-2 px-3 py-3 border border-gray-300 rounded-l-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      >
        <span className="text-lg">{selectedCountry.flag}</span>
        <span className="text-sm font-medium text-gray-700">{selectedCountry.code}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>
      
      {isCountryOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          {countries.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => {
                setSelectedCountry(country);
                setIsCountryOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              <span className="text-lg">{country.flag}</span>
              <span className="text-sm font-medium text-gray-700">{country.code}</span>
              <span className="text-sm text-gray-500 truncate">{country.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Login Form
  const LoginForm = () => (
    <div className="space-y-4">
      <div>
        <div className="block text-sm font-medium text-gray-700 mb-1">Email</div>
        <input
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:scale-[1.02] focus:scale-[1.02]"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <div className="block text-sm font-medium text-gray-700 mb-1">Password</div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12 hover:scale-[1.02] focus:scale-[1.02]"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:scale-110 transition-all duration-200"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <button
        type="button"
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105"
      >
        Sign In
      </button>
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => {
            setIsLoginOpen(false);
            setActiveModal('signup');
            setIsSignupOpen(true);
          }}
          className="text-blue-600 hover:text-blue-700 font-medium hover:scale-110 transition-all duration-200 inline-block transform"
        >
          Sign up
        </button>
      </p>
    </div>
  );

  // Signup Form
  const SignupForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">First Name</div>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus: