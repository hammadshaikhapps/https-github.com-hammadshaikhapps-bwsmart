import React from 'react';
import type { Page, PageContext } from '../types';

interface FooterProps {
  // FIX: Updated navigateTo to accept an optional context object to match its usage.
  navigateTo: (page: Page, context?: PageContext) => void;
}

const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-2">Customer Service</h3>
            <ul>
              <li className="mb-1"><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('help'); }} className="hover:text-orange-400">Help Center</a></li>
              <li className="mb-1"><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('track'); }} className="hover:text-orange-400">Track Order</a></li>
              <li className="mb-1"><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('returns'); }} className="hover:text-orange-400">Returns & Refunds</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">About Us</h3>
            <ul>
              <li className="mb-1"><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('story'); }} className="hover:text-orange-400">Our Story</a></li>
              <li className="mb-1"><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('careers'); }} className="hover:text-orange-400">Careers</a></li>
              <li className="mb-1"><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('press'); }} className="hover:text-orange-400">Press</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Shop with Us</h3>
            <ul>
              <li className="mb-1"><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('plp', {category: 'electronics'}); }} className="hover:text-orange-400">Electronics</a></li>
              <li className="mb-1"><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('plp', {category: 'fashion'}); }} className="hover:text-orange-400">Fashion</a></li>
              <li className="mb-1"><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('plp', {category: 'home-goods'}); }} className="hover:text-orange-400">Home Goods</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-orange-400">Facebook</a>
              <a href="#" className="hover:text-orange-400">Twitter</a>
              <a href="#" className="hover:text-orange-400">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} BWS Mart. All Rights Reserved.
        </div>
         <div className="mt-4 text-center text-xs">
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('admin'); }} className="text-gray-500 hover:text-orange-400">
            Admin Panel
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;