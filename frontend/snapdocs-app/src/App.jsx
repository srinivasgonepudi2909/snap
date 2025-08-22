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