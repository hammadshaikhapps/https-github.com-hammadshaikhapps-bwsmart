import React from 'react';
import type { Product, Page, PageContext } from '../types';
import StarRating from './StarRating';
import { ICONS } from '../constants';

interface ProductCardProps {
  product: Product;
  navigateTo: (page: Page, context: PageContext) => void;
  wishlist: number[];
  handleToggleWishlist: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, navigateTo, wishlist, handleToggleWishlist }) => {
  const isWishlisted = wishlist.includes(product.id);

  const onWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click navigation
    handleToggleWishlist(product.id);
  };

  const getStockStatus = () => {
    if (product.stockQuantity === 0) {
      return { text: 'Out of Stock', className: 'text-red-500' };
    }
    if (product.stockQuantity <= 10) {
      return { text: `Low Stock: Only ${product.stockQuantity} left!`, className: 'text-orange-500 text-xs' };
    }
    return { text: 'In Stock', className: 'text-green-600' };
  };
  const stockStatus = getStockStatus();


  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col relative"
      onClick={() => navigateTo('pdp', { productId: product.id })}
    >
      <button 
        onClick={onWishlistClick} 
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/70 hover:bg-white transition-all duration-200 active:scale-125"
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isWishlisted ? ICONS.heartFull : ICONS.heartOutline}
      </button>

      <div className={`w-full h-48 bg-gray-200 ${product.stockQuantity === 0 ? 'grayscale' : ''}`}>
        <img src={product.imageUrls?.[0] || 'https://picsum.photos/seed/placeholder/600/600'} alt={product.name} className="w-full h-full object-cover" loading="lazy"/>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        {/* Top section: Title and Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
        </div>
        
        {/* Bottom section: Pushed to the end */}
        <div className="mt-auto pt-4">
          <div className="mb-2">
            <StarRating rating={product.rating} />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-orange-500">${product.price.toFixed(2)}</span>
            <span className={`font-semibold ${stockStatus.className}`}>{stockStatus.text}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;