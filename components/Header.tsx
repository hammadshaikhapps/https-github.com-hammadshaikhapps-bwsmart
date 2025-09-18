import React, { useState, useEffect, useRef } from 'react';
import type { Page, PageContext, Suggestion, Product, Category, Brand, User } from '../types';
import { ICONS } from '../constants';

interface HeaderProps {
  cartItemCount: number;
  wishlistItemCount: number;
  navigateTo: (page: Page, context?: PageContext) => void;
  products: Product[];
  categories: Category[];
  brands: Brand[];
  currentUser: User | null;
  onSignOut: () => void;
  onSignInClick: () => void;
  onSignUpClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cartItemCount, wishlistItemCount, navigateTo, products, categories, brands,
  currentUser, onSignOut, onSignInClick, onSignUpClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchCategory, setSelectedSearchCategory] = useState('all');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  
  const NavLink: React.FC<{children: React.ReactNode, onClick: () => void}> = ({ children, onClick }) => (
    <a 
      href="#" 
      onClick={(e) => { e.preventDefault(); onClick(); }} 
      className="px-3 py-2 text-xl font-medium text-white rounded-md hover:outline outline-1 outline-white"
    >
      {children}
    </a>
  );

  const navLinks = [
    { label: 'All', action: () => navigateTo('plp', {}) },
    { label: 'Fresh', action: () => navigateTo('plp', { category: 'fresh' }) },
    { label: 'Best Sellers', action: () => navigateTo('plp', {}) },
    { label: "Today's Deals", action: () => navigateTo('plp', {}) },
    { label: 'New Releases', action: () => navigateTo('plp', {}) },
    { label: 'Prime', action: () => navigateTo('plp', {}) },
    { label: 'Mobile Phones', action: () => navigateTo('plp', { category: 'electronics', searchQuery: 'phone' }) },
    { label: 'Electronics', action: () => navigateTo('plp', { category: 'electronics' }) },
    { label: 'Health & Personal Care', action: () => navigateTo('plp', { category: 'health-personal-care' }) },
    { label: 'Fashion', action: () => navigateTo('plp', { category: 'fashion' }) },
    { label: 'Beauty', action: () => navigateTo('plp', { category: 'beauty' }) },
    { label: 'Perfumes', action: () => navigateTo('plp', { category: 'perfumes' }) },
    { label: 'Save more', action: () => navigateTo('plp', {}) },
    { label: 'Video Games', action: () => navigateTo('plp', { category: 'video-games' }) },
    { label: 'Grocery & Food', action: () => navigateTo('plp', { category: 'grocery-food' }) },
    { label: 'Automotive', action: () => navigateTo('plp', { category: 'automotive' }) },
    { label: 'Computers', action: () => navigateTo('plp', { category: 'computers' }) },
    { label: 'Home Services', action: () => navigateTo('plp', {}) },
    { label: 'Baby', action: () => navigateTo('plp', { category: 'baby' }) },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInsideDesktop = desktopSearchRef.current && desktopSearchRef.current.contains(target);
      const isClickInsideMobile = mobileSearchRef.current && mobileSearchRef.current.contains(target);

      if (!isClickInsideDesktop && !isClickInsideMobile) {
        setShowSuggestions(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 1) {
      const newSuggestions: Suggestion[] = [];
      const lowerQuery = query.toLowerCase();

      products.filter(p => p.name.toLowerCase().includes(lowerQuery)).slice(0, 3)
        .forEach(p => newSuggestions.push({ type: 'product', id: p.id, name: p.name }));
      categories.filter(c => c.name.toLowerCase().includes(lowerQuery)).slice(0, 2)
        .forEach(c => newSuggestions.push({ type: 'category', id: c.id, name: c.name }));
      brands.filter(b => b.name.toLowerCase().includes(lowerQuery)).slice(0, 2)
        .forEach(b => newSuggestions.push({ type: 'brand', id: b.id, name: b.name }));

      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: Suggestion) => {
    setShowSuggestions(false);
    setSearchQuery(''); 

    switch (suggestion.type) {
      case 'product': navigateTo('pdp', { productId: suggestion.id as number }); break;
      case 'category': navigateTo('plp', { category: suggestion.id as string }); break;
      case 'brand': navigateTo('plp', { brand: suggestion.id as string }); break;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      navigateTo('plp', { 
        searchQuery: searchQuery.trim(),
        searchCategory: selectedSearchCategory,
      });
    }
    setSearchQuery('');
  };

  const renderSuggestions = () => {
    const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
      (acc[suggestion.type] = acc[suggestion.type] || []).push(suggestion);
      return acc;
    }, {} as Record<Suggestion['type'], Suggestion[]>);

    const suggestionOrder: Suggestion['type'][] = ['product', 'category', 'brand'];

    return (
      <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg z-20 max-h-96 overflow-y-auto">
        {suggestionOrder.map(type => {
          const items = groupedSuggestions[type];
          if (!items || items.length === 0) return null;

          return (
            <div key={type}>
              <h4 className="px-3 py-2 text-xs font-bold text-gray-500 uppercase bg-gray-50 border-t border-b border-gray-100">{type}s</h4>
              <ul>
                {items.map(suggestion => (
                  <li key={`${suggestion.type}-${suggestion.id}`}>
                    <button onClick={() => handleSuggestionClick(suggestion)} className="w-full text-left p-3 hover:bg-gray-100 flex justify-between items-center text-black">
                      <span>{suggestion.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
  };
  
  const Logo = () => (
     <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="flex items-center flex-shrink-0 p-1 hover:outline outline-1 outline-white rounded-sm">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4z" clipRule="evenodd" />
      </svg>
      <span className="text-2xl font-bold text-white ml-1">BWS Mart</span>
    </a>
  );

  return (
    <header className="text-white">
      <div className="bg-gray-800">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
                <Logo />
                 <div className="hidden md:flex items-center p-2 hover:outline outline-1 outline-white rounded-sm cursor-pointer">
                    {ICONS.location}
                    <div className="ml-2 text-sm">
                        <span className="text-gray-300">Detected Location: </span>
                        <span className="font-bold">Dubai</span>
                    </div>
                 </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
                {currentUser ? (
                  <div className="flex items-center space-x-4">
                     <button onClick={() => navigateTo('profile')} className="hidden lg:block px-3 py-2 text-sm rounded-md hover:bg-white/10">
                        Welcome, {currentUser.name.split(' ')[0]}!
                     </button>
                    <button onClick={onSignOut} className="px-3 py-2 text-sm font-bold bg-orange-500 rounded-md hover:bg-orange-600">
                        Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="hidden lg:flex items-center space-x-2">
                     <button onClick={onSignInClick} className="px-3 py-2 text-sm font-bold rounded-md hover:bg-white/10">Sign In</button>
                     <button onClick={onSignUpClick} className="px-3 py-2 text-sm font-bold bg-orange-500 rounded-md hover:bg-orange-600">Sign Up</button>
                  </div>
                )}
                <button onClick={() => navigateTo('wishlist')} className="relative p-2 hover:outline outline-1 outline-white rounded-sm">
                    {wishlistItemCount > 0 ? ICONS.heartFull : ICONS.heartOutline}
                    {wishlistItemCount > 0 && (
                        <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-orange-500 rounded-full">{wishlistItemCount}</span>
                    )}
                </button>
                <button onClick={() => navigateTo('cart')} className="relative p-2 hover:outline outline-1 outline-white rounded-sm flex items-end space-x-1">
                    {React.cloneElement(ICONS.cart, { className: 'h-8 w-8' })}
                    <span className="hidden sm:inline font-bold text-sm">Cart</span>
                    {cartItemCount > 0 && (
                        <span className="absolute top-0 left-1/2 -translate-x-1/4 flex items-center justify-center h-5 w-5 text-xs font-bold text-orange-400">{cartItemCount}</span>
                    )}
                </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto px-2 sm:px-4 py-2 space-y-2">
            {/* Desktop Search Bar */}
            <div className="hidden md:block" ref={desktopSearchRef}>
              <form onSubmit={handleSearchSubmit} className="relative flex w-full">
                 <select 
                    value={selectedSearchCategory}
                    onChange={(e) => setSelectedSearchCategory(e.target.value)}
                    className="h-12 w-48 bg-gray-200 hover:bg-gray-300 border-r border-gray-400 text-xl text-black rounded-l-md focus:outline-none text-center"
                    aria-label="Select a category to search in"
                  >
                    <option value="all">All</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <div className="relative flex-grow">
                      <input type="search" value={searchQuery} onChange={handleSearchChange} onFocus={() => setShowSuggestions(suggestions.length > 0)} placeholder="Search BWS Mart"
                        className="w-full h-12 pl-4 pr-12 text-base bg-white focus:outline-none text-black" autoComplete="off" />
                      {showSuggestions && suggestions.length > 0 && renderSuggestions()}
                  </div>
                  <button type="submit" className="h-12 w-12 flex items-center justify-center text-gray-800 bg-orange-400 hover:bg-orange-500" aria-label="Search" style={{borderTopRightRadius: '0.375rem', borderBottomRightRadius: '0.375rem'}}>
                    {ICONS.search}
                  </button>
              </form>
            </div>

            {/* Mobile Search Bar */}
            <div className="md:hidden" ref={mobileSearchRef}>
              <form onSubmit={handleSearchSubmit} className="relative flex w-full">
                  <div className="relative flex-grow">
                      <input type="search" value={searchQuery} onChange={handleSearchChange} onFocus={() => setShowSuggestions(suggestions.length > 0)} placeholder="Search BWS Mart"
                        className="w-full h-12 pl-4 text-base bg-white rounded-l-md focus:outline-none text-black" autoComplete="off" />
                      {showSuggestions && suggestions.length > 0 && renderSuggestions()}
                  </div>
                  <button type="submit" className="h-12 w-12 flex items-center justify-center text-gray-800 bg-orange-400 hover:bg-orange-500 rounded-r-md" aria-label="Search">
                    {ICONS.search}
                  </button>
              </form>
            </div>
              <nav className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto whitespace-nowrap py-2 no-scrollbar">
                {navLinks.map((link) => (
                  <NavLink key={link.label} onClick={link.action}>{link.label}</NavLink>
                ))}
              </nav>
          </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    `}</style>
    </header>
  );
};

export default Header;