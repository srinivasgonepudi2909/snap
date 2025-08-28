// components/home/TestimonialsSection.jsx
import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
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
  );
};

export default TestimonialsSection;