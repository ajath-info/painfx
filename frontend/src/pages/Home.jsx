import React from "react";
import PublicLayout from "../layouts/PublicLayout";
import HeroBanner from "../components/home/HeroBanner";
import Ctasection from "../components/home/ctaSection";
import Specialities from "../components/home/Specialities";
import DoctorSection from "../components/home/DoctorSection";
import Features from "../components/home/Features";
import Partner from "../components/home/Partner";
import Blog from "../components/home/Blog";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Testiomals from "../components/home/Testiomals";
import Map from "../components/home/Map";
const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    if (token && user) {
      setIsLoggedIn(true);
      if (user.role === "doctor") {
        navigate("/doctor/dashboard");
      }
    }
  }, [navigate]);

  return (
    <PublicLayout>
      <HeroBanner />
      <Ctasection />
      <Specialities />
      <DoctorSection />
      <Features />
      <Testiomals />
      <Blog />
      <Partner />
      <Map />
    </PublicLayout>
  );
};

export default Home;
