import React from 'react';
import { useNavigate, Link ,useParams} from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Scrolltop from  '../common/Scrolltop';
import { FaArrowLeft } from 'react-icons/fa';
import Dentist from '../../images/dentist.webp';
import Urology from '../../images/urology.webp';
import Orthopedic from '../../images/orthopedic.webp';
import Neurology from '../../images/neurology.webp';
import Cardiologist from '../../images/neurology.webp';


function Specialitiesdetails() {
     const { id } = useParams();
  const navigate = useNavigate();
 const specialities = [
   { id: "1", name: 'Exposure Therapy', img: Urology,content:"We believe that informed patients heal better. That’s why we take the time to explain your condition and treatment plan clearly—helping you take control of your recovery. By understanding the why behind your symptoms and the how of your treatment, you're more likely to stay engaged and motivated throughout the healing process. Our team ensures that every patient feels heard, understood, and empowered. We walk you through every step, answer your questions with clarity. With this collaborative approach, we don’t just treat your condition—we help you become an active partner in your wellness journey." },
   { id: "2", name: 'Phychoanalysis', img: Neurology,content:"Our hands-on techniques, including soft and deep tissue massage as well as joint mobilisation or manipulation, are designed to relieve pain, restore movement, and accelerate healing. We assess each patient individually to develop personalized care plans that align with their unique needs. Our approach is rooted in evidence-based practices, ensuring the most effective and up-to-date treatments. We also emphasize patient education—helping you understand your condition and recovery process so you feel empowered every step of the way.   "},
   { id: "3", name: 'Phychodynamic Therapy', img: Orthopedic,content:"These methods target muscular pain and tightness by releasing trigger points—specific areas of tension that can cause discomfort and restrict movement. By applying focused pressure and therapeutic techniques, we help relax tight muscles and restore normal function. In addition to relieving muscle-related pain, these treatments can enhance joint mobility, improve circulation, and support better posture. They may also alleviate nerve-related symptoms such as tingling, numbness, or radiating pain, especially when caused by muscular imbalances or compression." },
   { id: "4", name: 'Dialectical Behaviour', img: Cardiologist,content:"Movement is medicine. That’s why we design personalized exercise programs tailored to your unique needs and goals. These routines focus on building strength, enhancing flexibility, improving balance, and restoring functional movement patterns—all essential components for long-term recovery and injury prevention. Whether you're recovering from an injury, managing a chronic condition, or working to improve overall mobility, our guided exercises empower you to move better and live stronger. Consistent, targeted movement not only speeds up healing but also promotes overall well-being." },
   { id: "5", name: 'Cognitive Behaviour', img: Dentist , content:"Taping is a versatile technique that can be used to improve posture, support weakened or injured joints, and limit unnecessary or harmful movements during activity. By providing gentle yet effective external support, taping helps reduce stress on vulnerable areas, promotes healing, and enhances body awareness. It’s often used in rehabilitation to prevent re-injury, alleviate pain, and encourage proper movement patterns—making it a valuable tool for both acute injuries and long-term recovery strategies." },
 ];
   const item = specialities.find((s) => s.id === id);

    if (!item) {
    return (
      <>
        <Header />
        <div className="text-center py-24 text-2xl">Speciality not found.</div>
        <Footer />
      </>
    );
  }
  return (
    <>
       <Header />
      <Scrolltop />

      {/* Top Bar */}
      <div className="bg-cyan-500 text-white w-full py-6 px-4">
        <div className="max-w-9xl mx-auto flex justify-between items-center text-lg">
          <div>
            <Link to="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <span className="font-semibold">Specialities</span>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-white text-cyan-500 hover:bg-cyan-500 hover:text-white border border-white px-6 py-2 cursor-pointer rounded-md transition duration-200 flex items-center gap-2"
          >
            <FaArrowLeft className="text-sm" />
            <span>Go Back</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          {/* Left Side: Image */}
          <div className="w-full md:w-1/2">
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-auto rounded-xl shadow-md"
            />
          </div>

          {/* Right Side: Heading and Content */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">
              {item.name}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
           {item.content}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Specialitiesdetails;
