import React, { useState } from 'react';

const DoctorsSection = () => {
  const doctors = [
    { name: 'Dr. John Doe', degree: 'MDS - Periodontology',rating: '⭐⭐⭐⭐⭐',availability: '  Avalibale on Fri,22 Mar', specialty: 'Cardiologist', rupee: '$100 - $400 ', img: 'https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827776.jpg', address: '123 Main Street, City, ' },
    { name: 'Dr. Sarah Lee', degree: 'MDS - Periodontology',rating: '⭐⭐⭐⭐⭐', availability: '  Avalibale on Fri,22 Mar',specialty: 'Neurologist', rupee: '$100 - $400 ', img: 'https://www.adsc.com/hs-fs/hubfs/shutterstock_156431549.jpg?width=250&name=shutterstock_156431549.jpg', address: '456 Elm Street, Town' },
    { name: 'Dr. Emily Clark',degree: 'MDS - Periodontology',rating: '⭐⭐⭐⭐⭐', availability: '  Avalibale on Fri,22 Mar', specialty: 'Orthopedic', rupee: '$100 - $400 ', img: 'https://www.shutterstock.com/image-vector/male-doctor-smiling-selfconfidence-flat-600nw-2281709217.jpg', address: '789 Oak Street, Village' },
    { name: 'Dr. Raj Patel', degree: 'MDS - Periodontology',rating: '⭐⭐⭐⭐⭐', availability: '  Avalibale on Fri,22 Mar',specialty: 'Dermatologist', rupee: '$100 - $400 ', img: 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsb2ZmaWNlMV9waG90b2dyYXBoeV9vZl9hbl9zb3V0aF9pbmRpYW5fd29tZW5fYXNfYV9kb2N0b19kMzAxMDM3Zi03MDUzLTQxNDAtYmYyZS1lZDFlYWE0YTM3NDRfMS5qcGc.jpg', address: '321 Pine Street, City' },
    { name: 'Dr. Linda Wong', degree: 'MDS - Periodontology',rating: '⭐⭐⭐⭐⭐' ,availability: '  Avalibale on Fri,22 Mar',specialty: 'Dentist', rupee: '$100 - $400 ', img: 'https://t3.ftcdn.net/jpg/01/67/15/98/360_F_167159846_MCrwVzB7ysdZKr2vIiJkiCacEoNWagdn.jpg', address: '654 Maple Street, Town' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 3;

  const nextSlide = () => {
    if (currentIndex + cardsPerPage < doctors.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const visibleDoctors = doctors.slice(currentIndex, currentIndex + cardsPerPage);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-start gap-8">
        
        {/* Left Side: Heading & Text */}
        <div className="md:w-1/3 text-left">
          <h2 className="text-5xl font-bold mb-4 text-black">Book Our Doctor</h2>
          <p className="text-gray-600 mb-4 text-xl"> Lorem Ipsum is simply dummy text</p>
          <p className="text-gray-600 mb-4 text-xl">
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum.
          </p>
          <p className="text-gray-500 text-xl">
          web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes
          </p>
        </div>

        {/* Right Side: Doctor Cards with Pagination */}
        <div className="md:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleDoctors.map((doc, index) => (
              <div key={index} className=" bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center text-center">
                <div className="w-42 h-42 overflow-hidden mb-4 text-left">
                  <img src={doc.img} alt={doc.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-semibold text-lg text-gray-900 mb-4">{doc.name}</h4>
                <p className="text-gray-500 ">{doc.degree}</p>
                <p className="text-gray-500 mb-2">{doc.specialty}</p>
                <p className='text-gray-500 mb-2'> {doc.rating}</p>
                <p className='text-gray-500 mb-2'> <i class="fa-solid fa-location-dot"></i>  {doc.address}</p>
                <p className='text-gray-500 mb-2'> <i class="fa-solid fa-clock"></i> {doc.availability}</p>
                <p className='text-gray-500 mb-2'> <i class="fa-solid fa-indian-rupee-sign"></i> {doc.rupee}</p>


                <div className="mt-auto mb-4 ">
                  <button className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded mt-4 mr-4">
                    Book Now
                  </button>
                  <button className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded mt-4">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-7 space-x-2">
            {Array.from({ length: Math.ceil(doctors.length - cardsPerPage + 1) }, (_, i) => (
              <span
                key={i}
                className={`h-2 w-6 rounded-full ${currentIndex === i ? 'bg-cyan-500' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;
