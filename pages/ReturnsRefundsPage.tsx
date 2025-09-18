import React from 'react';
import type { Page } from '../types';

interface ReturnsRefundsPageProps {
  navigateTo: (page: Page) => void;
}

const ReturnsRefundsPage: React.FC<ReturnsRefundsPageProps> = ({ navigateTo }) => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-800">Returns & Refunds</h1>
            <p className="text-gray-600 mt-2">We want you to be completely satisfied with your purchase. Here's everything you need to know.</p>
          </div>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Our 3-Day Return Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                You can return most new, unopened items within 3 days of delivery for a full refund. We'll also pay the return shipping costs if the return is a result of our error (you received an incorrect or defective item, etc.). You should expect to receive your refund within four weeks of giving your package to the return shipper, however, in many cases you will receive a refund more quickly.
              </p>
            </section>
            
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                How to Start a Return
              </h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>
                  <strong>Find Your Order:</strong> Visit the <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('track'); }} className="text-orange-600 hover:underline font-semibold">Track Order</a> page and enter your order details.
                </li>
                <li>
                  <strong>Select Items to Return:</strong> From your order details, select the item(s) you wish to return and the reason for the return.
                </li>
                <li>
                  <strong>Choose Return Method:</strong> Select your preferred return shipping method. We offer pre-paid labels for most returns.
                </li>
                <li>
                  <strong>Pack & Ship:</strong> Print your return label, pack your items securely, and drop the package off at the designated shipping location.
                </li>
              </ol>
               <button onClick={() => navigateTo('track')} className="mt-6 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600">
                Start a Return
              </button>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path></svg>
                Refunds and Exchanges
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Refunds:</strong> Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Exchanges:</strong> If you need to exchange an item for a different size or color, the quickest way is to return your original item for a refund and place a new order for the desired item.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">What items are non-returnable?</h3>
                  <p className="text-gray-600">Gift cards, downloadable software products, and some health and personal care items are not eligible for return.</p>
                </div>
                <div>
                  <h3 className="font-semibold">What if my item arrives damaged?</h3>
                  <p className="text-gray-600">Please contact our customer service within 48 hours of delivery with photos of the damaged item and packaging. We will arrange for a replacement or refund.</p>
                </div>
                <div>
                  <h3 className="font-semibold">How long does the return process take?</h3>
                  <p className="text-gray-600">From the day you ship your item, it can take up to 2 weeks for us to receive and process the return. You will be notified via email every step of the way.</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsRefundsPage;