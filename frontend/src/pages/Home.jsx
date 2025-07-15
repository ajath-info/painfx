import React from 'react';
import PublicLayout from '../layouts/PublicLayout';
import HeroBanner from '../components/home/HeroBanner';
import Ctasection from '../components/home/ctaSection';
import Specialities from '../components/home/Specialities';
import DoctorSection from '../components/home/DoctorSection';
import Features from '../components/home/Features';
import Partner from '../components/home/Partner';
import Blog from '../components/home/Blog';

const Home = () => {
  return (
    <PublicLayout>
      <HeroBanner />
      <Ctasection/>
      <Specialities />
      <DoctorSection />
      <Features />
      <Blog/>
       <Partner/>
    </PublicLayout>
  );
};

export default Home;
