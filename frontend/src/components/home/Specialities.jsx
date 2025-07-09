import React from 'react';

const Specialities = () => {
  const specialities = [
    { name: 'Urology', img: 'https://3.imimg.com/data3/FX/OA/MY-5132464/doctors-items-500x500.jpg' },
    { name: 'Neurology', img: 'https://ik.imagekit.io/alvwawmmq/endpoint/uploads/news-pictures/--blog-post-image-20190629150500.jpg' },
    { name: 'Orthopedic', img: 'https://c8.alamy.com/comp/HT89PW/desk-of-doctor-with-medicine-things-HT89PW.jpg' },
    { name: 'Cardiologist', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2HyldmKWncvIxUldL1NVmLB1NdfgTxJEQDA&s' },
    { name: 'Dentist', img: 'https://media.istockphoto.com/id/894125638/photo/stethoscope-on-the-table.jpg?s=612x612&w=0&k=20&c=JgYfIxI_Eo7dddZuePNGRnTrEJDOslL1x92k60IqkUc=' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Clinic & Specialities</h2>
          <p className="text-gray-500 text-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod <br /> tempor incididunt ut labore et dolore magna aliqua.
</p>
        </div>

        {/* Specialities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {specialities.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-55 h-52 rounded-full overflow-hidden shadow-lg flex items-center justify-center bg-white border border-gray-200 hover:shadow-xl transition duration-300">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-24 h-24 object-cover"
                />
              </div>
              <p className="mt-4 text-center text-lg font-semibold text-gray-800">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specialities;
