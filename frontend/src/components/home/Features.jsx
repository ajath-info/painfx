import React, { useState, useEffect } from 'react';

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
  const cardsPerPage = 4;

  // Auto-slide every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex =>
        prevIndex + cardsPerPage >= doctors.length ? 0 : prevIndex + 1
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [doctors.length]);

  const visibleDoctors = doctors.slice(currentIndex, currentIndex + cardsPerPage);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
        
        {/* Left Side: Image */}
        <div className="md:w-1/3 flex justify-center">
          <img 
            src="https://img.freepik.com/free-photo/medical-banner-with-doctor-holding-stethoscope_23-2149611198.jpg"
            alt="Clinic"
            className="rounded-2xl shadow-lg w-full object-cover"
          />
        </div>

        {/* Right Side: Text + Doctors */}
        <div className="md:w-2/3 text-center md:text-left">
          <h2 className="text-5xl text-gray-900 mb-8 text-center font-bold">Available Features in Our Clinic</h2>
          <p className="text-gray-600 mb-8 text-center text-xl">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {visibleDoctors.map((doc, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-55 h-52 sm:w-55 sm:h-55 rounded-full overflow-hidden border-2 border-cyan-500 mb-2">
                  <img src={doc.img} alt={doc.title} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-semibold text-sm text-gray-800">{doc.title}</h4>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-4 space-x-2 mb-12">
            {Array.from({ length: Math.ceil(doctors.length / cardsPerPage) }, (_, i) => (
              <span
                key={i}
                className={`h-2 w-6 rounded-full ${Math.floor(currentIndex / cardsPerPage) === i ? 'bg-cyan-500' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;
