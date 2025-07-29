import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-10 text-gray-800">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-xl p-8 space-y-6">
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

        <div className="text-center">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer mt-4 bg-cyan-500 hover:bg-cyan-500 text-white px-6 py-2 rounded-md transition duration-200"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
