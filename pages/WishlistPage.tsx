import React from 'react';
import type { Product, Page, PageContext } from '../types';
import ProductCard from '../components/ProductCard';

interface WishlistPageProps {
  wishlist: number[];
  products: Product[];
  navigateTo: (page: Page, context?: PageContext) => void;
  handleToggleWishlist: (productId: number) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ wishlist, products, navigateTo, handleToggleWishlist }) => {
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-red-500 mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800">Your Wishlist is Empty</h1>
          <p className="text-gray-600 mt-4">Looks like you haven't added any of your favorite items yet. Start exploring and add products you love!</p>
          <button 
            onClick={() => navigateTo('home')}
            className="mt-8 px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors"
          >
            Discover Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist ({wishlistedProducts.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistedProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            navigateTo={navigateTo} 
            wishlist={wishlist} 
            handleToggleWishlist={handleToggleWishlist} 
          />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;