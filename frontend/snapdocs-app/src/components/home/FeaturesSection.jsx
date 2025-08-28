import React from 'react';
import { Upload, Folder, Shield } from 'lucide-react';

const FeaturesSection = () => {
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

  return (
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
  );
};

export default FeaturesSection;