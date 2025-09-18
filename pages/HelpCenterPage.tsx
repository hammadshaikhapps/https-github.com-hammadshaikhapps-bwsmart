import React, { useState } from 'react';
import type { Page } from '../types';

interface HelpCenterPageProps {
  navigateTo: (page: Page) => void;
}

const faqsData = {
  'Shipping & Delivery': [
    { q: 'What are your shipping options?', a: 'We offer Standard (3-5 business days), Expedited (2 business days), and Priority (next business day) shipping options.' },
    { q: 'How can I track my order?', a: 'Once your order ships, you will receive an email with a tracking number. You can also track your order from the "Track Order" page.' },
    { q: 'Do you ship internationally?', a: 'Currently, we only ship within the country. We are working on expanding our shipping options to include international destinations in the near future.' },
  ],
  'Returns & Refunds': [
    { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery for a full refund. Items must be in their original condition. Please see our "Returns & Refunds" page for more details.' },
    { q: 'How do I start a return?', a: 'You can start a return by visiting our "Returns & Refunds" page and entering your order information. We will guide you through the process.' },
    { q: 'When will I receive my refund?', a: 'Once we receive and inspect your returned item, we will process your refund within 5-7 business days. The refund will be issued to your original payment method.' },
  ],
  'Payments & Billing': [
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and BWS Mart gift cards.' },
    { q: 'Is my payment information secure?', a: 'Yes, we use industry-standard SSL encryption to protect your details. Your payment information is securely transmitted to our payment processor.' },
  ],
  'Account Management': [
    { q: 'How do I create an account?', a: 'You can create an account by clicking the "Sign In" button on the header and selecting "Create Account".' },
    { q: 'I forgot my password. What should I do?', a: 'You can reset your password by clicking the "Forgot Password" link on the sign-in page. We will send you an email with instructions.' },
  ],
};

const AccordionItem: React.FC<{ q: string; a: string; }> = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-50"
            >
                <span className="font-semibold">{q}</span>
                <svg className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && <div className="p-4 bg-gray-50 text-gray-700">{a}</div>}
        </div>
    );
};

const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ navigateTo }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = Object.entries(faqsData).reduce((acc, [category, questions]) => {
    if (searchTerm.trim() === '') {
      acc[category] = questions;
      return acc;
    }
    const matchingQuestions = questions.filter(
        faq => faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (matchingQuestions.length > 0) {
        acc[category] = matchingQuestions;
    }
    return acc;
  }, {} as typeof faqsData);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800">How can we help?</h1>
        <div className="mt-4 max-w-2xl mx-auto relative">
          <input 
            type="search"
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-4 border rounded-full shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
          <svg className="w-6 h-6 absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 text-center">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="text-gray-600">Track packages and view delivery options.</p>
        </div>
         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
          <h2 className="text-xl font-bold mb-2">Returns</h2>
          <p className="text-gray-600">Start a return and learn about our policy.</p>
        </div>
         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
          <h2 className="text-xl font-bold mb-2">Payments</h2>
          <p className="text-gray-600">Manage payment methods and view transactions.</p>
        </div>
         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
          <h2 className="text-xl font-bold mb-2">Account</h2>
          <p className="text-gray-600">Update your profile and security settings.</p>
        </div>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        {Object.keys(filteredFaqs).length > 0 ? (
            <div className="space-y-8">
            {Object.entries(filteredFaqs).map(([category, questions]) => (
                <div key={category}>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-700">{category}</h3>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {questions.map((faq, index) => (
                            <AccordionItem key={index} q={faq.q} a={faq.a} />
                        ))}
                    </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700">No results found for "{searchTerm}"</h3>
                <p className="text-gray-500 mt-2">Try searching for something else.</p>
            </div>
        )}
      </div>

      <div className="mt-16 text-center bg-gray-100 p-8 rounded-lg">
        <h2 className="text-2xl font-bold">Still need help?</h2>
        <p className="text-gray-600 mt-2">Our customer service team is here for you.</p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600">Live Chat</button>
            <button className="px-6 py-3 bg-white text-orange-500 border border-orange-500 font-semibold rounded-lg shadow-sm hover:bg-orange-50">Email Us</button>
            <p className="text-gray-700">or call us at <span className="font-semibold">1-800-BWS-MART</span></p>
        </div>
      </div>

    </div>
  );
};

export default HelpCenterPage;