// components/home/DocumentTypesSection.jsx
import React from 'react';

const DocumentTypesSection = () => {
  const documentTypes = [
    { icon: "📄", title: "ID Documents", desc: "Passport, License, Aadhar, PAN Card" },
    { icon: "🎓", title: "Certificates", desc: "Degrees, Courses, Awards, Diplomas" },
    { icon: "🏠", title: "Property Docs", desc: "Deeds, Insurance, Agreements" },
    { icon: "💼", title: "Business Files", desc: "Contracts, Invoices, Reports" },
    { icon: "🏥", title: "Medical Records", desc: "Reports, Prescriptions, Insurance" },
    { icon: "💰", title: "Financial", desc: "Bank Statements, Tax Records, Investments" },
    { icon: "✈️", title: "Travel", desc: "Tickets, Visas, Bookings, Itineraries" },
    { icon: "📱", title: "Personal", desc: "Photos, Notes, Memories, Receipts" }
  ];

  return (
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
          {documentTypes.map((type, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{type.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{type.title}</h3>
              <p className="text-gray-400 text-sm">{type.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DocumentTypesSection;