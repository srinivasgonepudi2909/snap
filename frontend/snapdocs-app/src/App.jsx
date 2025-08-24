import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import AboutUs from './components/AboutUs';
import HowItWorks from './components/HowItWorks';
import Contact from './components/Contact';
import Dashboard from './pages/Dashboard'; // ✅ Add this import

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/dashboard" element={<Dashboard />} />  {/* ✅ Dashboard route added */}
    </Routes>
  );
};

export default App;
