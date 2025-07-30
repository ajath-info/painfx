import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';  
import { FaArrowLeft } from 'react-icons/fa';


const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <>
<Header />

{/* Breadcrumb */}
         <div className="bg-cyan-500 text-white w-full py-6 px-4">
          <div className="max-w-9xl mx-auto flex justify-between items-center text-lg">
            <div>
              <Link to="/" className="hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <span className="font-semibold">Privacy-Policy</span>
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
    <div className="min-h-[20vh] sm:min-h-[70vh] flex flex-col items-center justify-center px-4 bg-gray-50 text-gray-800">

      <div className="max-w-7xl w-full bg-gray-50 rounded-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Privacy Policy</h1>

        <p>
          We are committed to protecting your personal information and your right to privacy. This Privacy Policy describes how we collect, use, and safeguard your data when you use our website.
        </p>

        <ul className="list-disc list-inside space-y-3">
          <li>
            <strong>Information Collection:</strong> We may collect personal information such as name, email, phone number, and usage data when you interact with our site or services.
          </li>
          <li>
            <strong>Use of Information:</strong> Your data is used to improve our services, communicate with you, and ensure better user experience.
          </li>
          <li>
            <strong>Data Sharing:</strong> We do not sell, trade, or rent your personal information to third parties unless required by law.
          </li>
          <li>
            <strong>Security:</strong> We take reasonable steps to protect your personal data but cannot guarantee absolute security.
          </li>
          <li>
            <strong>Your Rights:</strong> You may request access, modification, or deletion of your data by contacting us.
          </li>
        </ul>

        <p>
          By using our site, you agree to the terms of this privacy policy. If you have any questions, feel free to reach out to our support team.
        </p>
      </div>
    </div>
    <Footer />
      </>
  );
};

export default PrivacyPolicy;
