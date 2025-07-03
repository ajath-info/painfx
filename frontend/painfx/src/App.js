import React from 'react';
import './app.css';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import Specialities from './components/Specialities';
import DoctorSection from './components/DoctorSections';
import Features from './components/Features';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <div className="main-wrapper">
        <Header />
        <HeroBanner />
        <Specialities />
        <DoctorSection />
        <Features />
        <Footer />
      </div>
    </div>
  );
}

export default App;