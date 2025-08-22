import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, User, MapPin, Clock, Phone, MessageCircle, Calendar, Award } from 'lucide-react';

const Contact = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "General Support",
      description: "Questions about features, billing, or technical issues",
      contact: "srigonepudi@gmail.com",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: MessageCircle,
      title: "Feedback & Suggestions", 
      description: "Share your ideas for improving SnapDocs",
      contact: "srigonepudi@gmail.com",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Award,
      title: "Business Partnerships",
      description: "Collaboration opportunities and enterprise solutions", 
      contact: "srigonepudi@gmail.com",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 page-transition">
      <header className="bg-gray-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-300">
                <div className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
                <div className="text-white font-bold text-base z-10">SD</div>
                <div className="absolute bottom-1 right-1 w-4 h-2 bg-white rounded-sm opacity-80"></div>
              </div>
              <span className="text-2xl font-bold text-white">SnapDocs</span>
            </Link>
            <Link to="/" className="flex items-center space-x-2 text-gray-300 hover:text-white font-bold transition-all duration-300 hover:scale-110">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="w-48 h-48 mx-auto mb-8 relative">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 animate-scale-in">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <User className="w-24 h-24 text-gray-600" />
                </div>
              </div>
              <div className="absolute bottom-4 right-4 w-14 h-14 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Gonepudi Srinivas</span>
            </h1>
            <div className="space-y-3 mb-8">
              <p className="text-3xl text-blue-400 font-semibold">Founder & CEO, SnapDocs</p>
              <p className="text-xl text-gray-400">29 years old • Tech Entrepreneur • Document Security Expert</p>
              <div className="flex items-center justify-center space-x-8 text-gray-400 flex-wrap">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  <span>Based in India 🇮🇳</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span>Usually responds within 24 hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span>5+ Years in Tech</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Primary Contact */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-3xl p-8 border border-white/20 group hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-300">
              <div className="text-center">
                <Mail className="w-16 h-16 text-blue-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-white mb-4">Primary Contact</h3>
                <a 
                  href="mailto:srigonepudi@gmail.com"
                  className="text-2xl text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline block mb-4"
                >
                  srigonepudi@gmail.com
                </a>
                <p className="text-gray-300">
                  For all inquiries including support, partnerships, feedback, or general questions about SnapDocs.
                </p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-3xl p-8 border border-white/20 group hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-300">
              <div className="text-center">
                <Phone className="w-16 h-16 text-purple-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-bold text-white mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="w-5 h-5 text-green-400" />
                    <span>Monday - Friday: 9 AM - 6 PM IST</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span>Weekend: Emergency support only</span>
                  </div>
                </div>
                <p className="text-gray-300 mt-4">
                  Available for urgent matters and business partnerships during extended hours.
                </p>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 mb-16 animate-slide-up">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">About the Founder</h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Gonepudi Srinivas is a passionate tech entrepreneur with over 5 years of experience in building 
                    secure digital solutions. With a background in computer science and cybersecurity, he founded 
                    SnapDocs to address the growing need for secure document management in the digital age.
                  </p>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    His vision for SnapDocs stems from personal experience with document loss and the frustration 
                    of existing solutions that compromise either security or usability. Under his leadership, 
                    SnapDocs has grown to serve thousands of users worldwide.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-2">Expertise</h3>
                    <div className="grid grid-cols-2 gap-2 text-gray-300">
                      <div>• Cybersecurity</div>
                      <div>• Cloud Architecture</div>
                      <div>• Product Design</div>
                      <div>• User Experience</div>
                      <div>• Data Privacy</div>
                      <div>• Scalable Systems</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Get in <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Touch</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center group hover:bg-white/15 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{method.description}</p>
                  <a 
                    href={`mailto:${method.contact}`}
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline"
                  >
                    {method.contact}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Response Time */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <Clock className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Quick Response Guaranteed</h3>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
                I personally read and respond to every email. You can expect a response within 24 hours, 
                often much sooner during business hours.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-400">&lt; 4 hours</div>
                  <div className="text-gray-400">Business Hours</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-400">&lt; 24 hours</div>
                  <div className="text-gray-400">General Inquiries</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-400">&lt; 1 hour</div>
                  <div className="text-gray-400">Critical Issues</div>
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
