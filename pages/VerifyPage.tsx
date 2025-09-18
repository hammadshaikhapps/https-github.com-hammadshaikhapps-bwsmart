import React from 'react';

interface VerifyPageProps {
  email: string;
  onVerify: (email: string) => void;
}

const VerifyPage: React.FC<VerifyPageProps> = ({ email, onVerify }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <svg className="w-16 h-16 mx-auto text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        <h1 className="text-4xl font-bold text-gray-800 mt-4">Verify Your Email Address</h1>
        <p className="text-gray-600 mt-4">
          Thank you for signing up! To complete your registration, please verify your email address. We've sent a confirmation link to:
        </p>
        <p className="text-lg font-semibold text-gray-700 my-4">{email}</p>
        <p className="text-gray-500 text-sm">
          (For this simulation, just click the button below to verify your account.)
        </p>
        <button 
          onClick={() => onVerify(email)}
          className="mt-8 px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors"
        >
          Verify My Account
        </button>
      </div>
    </div>
  );
};

export default VerifyPage;
