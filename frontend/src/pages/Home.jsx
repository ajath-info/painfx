import React from 'react';
import PublicLayout from '../layouts/PublicLayout';
import HeroBanner from '../components/home/HeroBanner';
import Specialities from '../components/home/Specialities';
import DoctorSection from '../components/home/DoctorSection';
import Features from '../components/home/Features';
import Partner from '../components/home/Partner';

const Home = () => {
  return (
    <PublicLayout>
      <HeroBanner />
      <Specialities />
      <DoctorSection />
      <Features />
       <Partner/>
    </PublicLayout>
  );
};

export default Home;
