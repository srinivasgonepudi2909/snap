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
