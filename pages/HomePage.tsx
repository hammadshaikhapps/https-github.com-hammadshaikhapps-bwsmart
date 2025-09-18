
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import type { Product, Category, Page, PageContext } from '../types';
import ProductCard from '../components/ProductCard';
import { CATEGORY_ICONS } from '../constants';

const slides = [
  {
    headline: 'Tech Extravaganza',
    description: 'Up to 40% off on the latest electronics. Upgrade your life!',
    category: 'electronics',
    imageUrl: 'https://picsum.photos/seed/tech-banner/1200/600',
  },
  {
    headline: 'Style Unleashed',
    description: 'Discover the new season\'s trends with our exclusive fashion collection.',
    category: 'fashion',
    imageUrl: 'https://picsum.photos/seed/fashion-banner/1200/600',
  },
  {
    headline: 'Elevate Your Space',
    description: 'Find the perfect pieces to make your house a home. Deals on all home goods.',
    category: 'home-goods',
    imageUrl: 'https://picsum.photos/seed/home-banner/1200/600',
  },
  {
    headline: 'Discover New Worlds',
    description: 'Get lost in a story. Bestselling books and new arrivals are now on sale.',
    category: 'books',
    imageUrl: 'https://picsum.photos/seed/books-banner/1200/600',
  },
  {
    headline: 'Gear Up & Go',
    description: 'Top-tier sports equipment to help you achieve your fitness goals.',
    category: 'sports',
    imageUrl: 'https://picsum.photos/seed/sports-banner/1200/600',
  },
  {
    headline: 'Unleash the Fun!',
    description: 'Explore a universe of toys and games for all ages. Let the adventure begin!',
    category: 'toys',
    imageUrl: 'https://picsum.photos/seed/toys-banner/1200/600',
  },
];

const AnimationStyles = () => (
  <style>{`
    @keyframes kenburns {
      0% {
        transform: scale(1) translate(0, 0);
      }
      100% {
        transform: scale(1.1) translate(-1%, 1%);
      }
    }
    .animate-kenburns {
      animation: kenburns 10s ease-out forwards;
    }

    @keyframes fadeInSlideUp {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-text {
        animation: fadeInSlideUp 1s ease-out forwards;
    }
    .text-shadow-custom {
        text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
    }
  `}</style>
);

interface HomePageProps {
  products: Product[];
  categories: Category[];
  navigateTo: (page: Page, context?: PageContext) => void;
  wishlist: number[];
  handleToggleWishlist: (productId: number) => void;
}

const HomePage: React.FC<HomePageProps> = ({ products, categories, navigateTo, wishlist, handleToggleWishlist }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [numFeaturedToShow, setNumFeaturedToShow] = useState(10);
  const [numBestsellersToShow, setNumBestsellersToShow] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleScroll = useCallback(() => {
    if (isLoading) return;
    // Check if user is near the bottom of the page
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200) {
        setIsLoading(true);
        // Using setTimeout to simulate a network request and prevent rapid firing
        setTimeout(() => {
            setNumFeaturedToShow(prev => prev + 5);
            setNumBestsellersToShow(prev => prev + 5);
            setIsLoading(false);
        }, 400); 
    }
  }, [isLoading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentSlide]);
  
  const featuredProductPool = useMemo(() => products.slice(0, 16), [products]);
  
  const bestSellerPool = useMemo(() => {
    return [...products]
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 16);
  }, [products]);

  const displayedFeaturedProducts = useMemo(() => {
    if (featuredProductPool.length === 0) return [];
    const items = [];
    for (let i = 0; i < numFeaturedToShow; i++) {
        items.push(featuredProductPool[i % featuredProductPool.length]);
    }
    return items;
  }, [numFeaturedToShow, featuredProductPool]);
  
  const displayedBestsellers = useMemo(() => {
    if (bestSellerPool.length === 0) return [];
    const items = [];
    for (let i = 0; i < numBestsellersToShow; i++) {
        items.push(bestSellerPool[i % bestSellerPool.length]);
    }
    return items;
  }, [numBestsellersToShow, bestSellerPool]);

  const activeSlide = slides[currentSlide];

  return (
    <div className="space-y-12">
      <AnimationStyles />
      <section className="relative mt-8 w-full h-[60vh] max-h-[600px] rounded-lg overflow-hidden shadow-2xl">
        <div className="relative w-full h-full">
            <img 
                key={currentSlide}
                src={activeSlide.imageUrl} 
                alt={activeSlide.headline} 
                className="absolute inset-0 w-full h-full object-cover animate-kenburns"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
                <div key={currentSlide} className="animate-text">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-shadow-custom">
                        {activeSlide.headline}
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto font-bold text-shadow-custom">
                        {activeSlide.description}
                    </p>
                </div>
                 <button 
                    onClick={() => navigateTo('plp', { category: activeSlide.category })}
                    className="mt-8 px-8 py-3 bg-white text-orange-500 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-transform hover:scale-105 duration-300 animate-text"
                    style={{ animationDelay: '0.2s' }}
                    >
                    Shop Now
                </button>
            </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
            {categories.slice(0, 8).map((category) => (
              <div 
                key={category.id} 
                onClick={() => navigateTo('plp', { category: category.id })}
                className="group bg-gradient-to-br from-gray-50 to-gray-200 p-4 rounded-xl cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center aspect-square"
              >
                <div className="w-2/3 h-2/3 text-orange-500 drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
                  {CATEGORY_ICONS[category.id] || <div className="w-full h-full bg-gray-300 rounded-md" />}
                </div>
                <h3 className="text-gray-800 text-sm md:text-base font-bold text-center mt-2">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayedFeaturedProducts.map((product, index) => (
              <ProductCard key={`${product.id}-${index}`} product={product} navigateTo={navigateTo} wishlist={wishlist} handleToggleWishlist={handleToggleWishlist} />
            ))}
          </div>
        </div>
      </section>
      
      <section>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Best Sellers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {displayedBestsellers.map((product, index) => (
              <ProductCard key={`${product.id}-${index}`} product={product} navigateTo={navigateTo} wishlist={wishlist} handleToggleWishlist={handleToggleWishlist} />
            ))}
          </div>
        </div>
      </section>
      {isLoading && 
        <div className="text-center py-4">
            <p className="text-gray-500">Loading more products...</p>
        </div>
      }
    </div>
  );
};

export default HomePage;
