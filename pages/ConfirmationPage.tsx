
import React from 'react';
import type { Page, PageContext } from '../types';

interface ConfirmationPageProps {
  context: PageContext;
  navigateTo: (page: Page) => void;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ context, navigateTo }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 className="text-4xl font-bold text-gray-800 mt-4">Thank You For Your Order!</h1>
        <p className="text-gray-600 mt-4">
          Your order has been placed successfully. A confirmation email has been sent to you.
        </p>
        <p className="text-lg font-semibold text-gray-700 mt-6">
          Order ID: <span className="text-orange-500">{context.orderId}</span>
        </p>
        <button 
          onClick={() => navigateTo('home')}
          className="mt-8 px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
