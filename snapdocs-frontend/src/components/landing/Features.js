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
