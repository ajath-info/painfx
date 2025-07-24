import React, { useState, useEffect } from 'react';
import feature from '../../images/feature.png';

const Features = () => {
  const doctors = [
    { title: 'Dr. John Doe', specialty: 'Cardiologist', img: 'https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827776.jpg' },
    { title: 'Dr. Sarah Lee', specialty: 'Neurologist', img: 'https://www.adsc.com/hs-fs/hubfs/shutterstock_156431549.jpg?width=250&name=shutterstock_156431549.jpg' },
    { title: 'Dr. Emily Clark', specialty: 'Orthopedic', img: 'https://www.shutterstock.com/image-vector/male-doctor-smiling-selfconfidence-flat-600nw-2281709217.jpg' },
    { title: 'Dr. Raj Patel', specialty: 'Dermatologist', img: 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsb2ZmaWNlMV9waG90b2dyYXBoeV9vZl9hbl9zb3V0aF9pbmRpYW5fd29tZW5fYXNfYV9kb2N0b19kMzAxMDM3Zi03MDUzLTQxNDAtYmYyZS1lZDFlYWE0YTM3NDRfMS5qcGc.jpg' },
    { title: 'Dr. Linda Wong', specialty: 'Dentist', img: 'https://t3.ftcdn.net/jpg/01/67/15/98/360_F_167159846_MCrwVzB7ysdZKr2vIiJkiCacEoNWagdn.jpg' },
    { title: 'Dr. Alex Smith', specialty: 'Pediatrician', img: 'https://img.freepik.com/free-photo/portrait-smiling-male-doctor-using-digital-tablet-hospital-corridor_107420-84818.jpg' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Responsive cards per page
  const getCardsPerPage = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 4; // lg and above
      if (window.innerWidth >= 768) return 3;  // md
      if (window.innerWidth >= 640) return 2;  // sm
      return 1; // mobile
    }
    return 4; // default
  };

  const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage());

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setCardsPerPage(getCardsPerPage());
      setCurrentIndex(0); // Reset to first slide on resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const maxIndex = Math.max(0, doctors.length - cardsPerPage);
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [doctors.length, cardsPerPage]);

  const visibleDoctors = doctors.slice(currentIndex, currentIndex + cardsPerPage);
  const totalSlides = Math.max(1, doctors.length - cardsPerPage + 1);

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Container */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Left Side: Image */}
          <div className="w-full lg:w-2/5 xl:w-1/3 flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              <img 
                src={feature}
                alt="Modern Clinic Interior"
                className="rounded-2xl shadow-xl w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-300 hover:scale-105"
              />
              {/* Decorative overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="w-full lg:w-3/5 xl:w-2/3 text-center lg:text-left">
            
            {/* Header */}
            <div className="mb-8 lg:mb-12 mx-auto my-auto text-center ">
              <div className="mx-auto text-center max-w-3xl lg:max-w-4xl xl:max-w-5xl my-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
                Available Features in Our Clinic
              </h2>
              <p className="text-gray-600 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Discover our comprehensive healthcare services with experienced professionals dedicated to your well-being and comfort.
              </p>
            </div>
              
            </div>

            {/* Doctors Cards Container */}
            <div className="relative overflow-hidden mb-8">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (100 / cardsPerPage)}%)` }}
              >
                {doctors.map((doctor, index) => (
                  <div 
                    key={index} 
                    className={`flex-shrink-0 px-2 sm:px-3 ${
                      cardsPerPage === 1 ? 'w-full' :
                      cardsPerPage === 2 ? 'w-1/2' :
                      cardsPerPage === 3 ? 'w-1/3' : 'w-1/4'
                    }`}
                  >
                    <div className="flex flex-col items-center group cursor-pointer">
                      
                      {/* Doctor Image */}
                      <div className="relative mb-3 sm:mb-4">
                        <div className="w-30 h-30 sm:w-40 sm:h-40 md:w-34 md:h-34 lg:w-38 lg:h-38 rounded-full overflow-hidden border-3 border-cyan-500 shadow-lg transition-all duration-300 group-hover:border-cyan-600 group-hover:shadow-xl group-hover:scale-105">
                          <img 
                            src={doctor.img} 
                            alt={doctor.title} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                          />
                        </div>
                        {/* Pulse animation */}
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-20"></div>
                      </div>
                      
                      {/* Doctor Info */}
                      <div className="text-center">
                        <h4 className="font-semibold text-sm sm:text-base text-gray-800 mb-1 transition-colors duration-300 group-hover:text-cyan-600">
                          {doctor.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">
                          {doctor.specialty}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;