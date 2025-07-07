import React from 'react';
import PublicLayout from '../layouts/PublicLayout';
import HeroBanner from '../components/home/HeroBanner';
import Specialities from '../components/home/Specialities';
import DoctorSection from '../components/home/DoctorSection';
import Features from '../components/home/Features';

const Home = () => {
  return (
    <PublicLayout>
      <HeroBanner />
      <Specialities />
      <DoctorSection />
      <Features />
    </PublicLayout>
  );
};

export default Home;
