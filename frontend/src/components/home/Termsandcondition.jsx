import React from 'react';
import { useNavigate,Link } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { FaArrowLeft } from 'react-icons/fa';

const TermsAndConditions = () => {
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
              <span className="font-semibold">Terms & Condition</span>
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
        <h1 className="text-3xl font-bold text-center">Terms & Conditions</h1>

        <p>
          By accessing or using our website, you agree to be bound by the following terms and conditions. Please read them carefully before proceeding.
        </p>

        <ul className="list-disc list-inside space-y-3">
          <li>
            <strong>Acceptance of Terms:</strong> Your use of the site signifies your acceptance of these terms. If you do not agree, please discontinue use.
          </li>
          <li>
            <strong>Modification:</strong> We reserve the right to modify these terms at any time. Continued use of the website after changes means you accept the new terms.
          </li>
          <li>
            <strong>Content Usage:</strong> All content on the site is the property of the company and may not be reproduced without permission.
          </li>
          <li>
            <strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account credentials.
          </li>
          <li>
            <strong>Limitation of Liability:</strong> We are not liable for any direct, indirect, or incidental damages arising from your use of the site.
          </li>
        </ul>

        <p>
          If you have questions about these terms, please contact our support team for clarification.
        </p>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default TermsAndConditions;
