import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Product, Category, Brand, Page, PageContext, Suggestion } from '../types';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';

interface ProductListPageProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  navigateTo: (page: Page, context?: PageContext) => void;
  initialFilters?: PageContext;
  wishlist: number[];
  handleToggleWishlist: (productId: number) => void;
}

const ProductListPage: React.FC<ProductListPageProps> = ({ products, categories, brands, navigateTo, initialFilters, wishlist, handleToggleWishlist }) => {
  const filters = initialFilters || {};
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(filters.category ? [filters.category] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(filters.brand ? [filters.brand] : []);
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [sortOrder, setSortOrder] = useState('featured');
  
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
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

      products
        .filter(p => p.name.toLowerCase().includes(lowerQuery))
        .slice(0, 3)
        .forEach(p => newSuggestions.push({ type: 'product', id: p.id, name: p.name }));

      categories
        .filter(c => c.name.toLowerCase().includes(lowerQuery))
        .slice(0, 2)
        .forEach(c => newSuggestions.push({ type: 'category', id: c.id, name: c.name }));

      brands
        .filter(b => b.name.toLowerCase().includes(lowerQuery))
        .slice(0, 2)
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
    setSearchQuery(''); // Clear the search bar after selection

    switch (suggestion.type) {
        case 'product':
            navigateTo('pdp', { productId: suggestion.id as number });
            break;
        case 'category':
            if (!selectedCategories.includes(suggestion.id as string)) {
                setSelectedCategories(prev => [...prev, suggestion.id as string]);
            }
            break;
        case 'brand':
            if (!selectedBrands.includes(suggestion.id as string)) {
                setSelectedBrands(prev => [...prev, suggestion.id as string]);
            }
            break;
    }
  };
  
  const renderSuggestions = () => {
    const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
      (acc[suggestion.type] = acc[suggestion.type] || []).push(suggestion);
      return acc;
    }, {} as Record<Suggestion['type'], Suggestion[]>);

    const suggestionOrder: Suggestion['type'][] = ['product', 'category', 'brand'];

    return (
      <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-lg shadow-lg z-10 max-h-96 overflow-y-auto">
        {suggestionOrder.map(type => {
          const items = groupedSuggestions[type];
          if (!items || items.length === 0) return null;

          return (
            <div key={type}>
              <h4 className="px-3 py-2 text-xs font-bold text-gray-500 uppercase bg-gray-50 border-t border-b border-gray-100">{type}s</h4>
              <ul>
                {items.map(suggestion => (
                  <li key={`${suggestion.type}-${suggestion.id}`}>
                    <button onClick={() => handleSuggestionClick(suggestion)} className="w-full text-left p-3 hover:bg-gray-100 flex justify-between items-center">
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

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(c => c !== categoryId) : [...prev, categoryId]
    );
  };

  const handleBrandChange = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId) ? prev.filter(b => b !== brandId) : [...prev, brandId]
    );
  };

  const filteredProducts = useMemo(() => {
    let priceFilterFromSearch = { min: 0, max: Infinity };
    let cleanSearchQuery = searchQuery.toLowerCase().trim();

    const underMatch = cleanSearchQuery.match(/(?:under|less than|<)\s*\$?(\d+\.?\d*)/);
    const overMatch = cleanSearchQuery.match(/(?:over|greater than|>)\s*\$?(\d+\.?\d*)/);
    const rangeMatch = cleanSearchQuery.match(/\$?(\d+\.?\d*)\s*-\s*\$?(\d+\.?\d*)/);

    if (rangeMatch) {
      priceFilterFromSearch.min = Number(rangeMatch[1]);
      priceFilterFromSearch.max = Number(rangeMatch[2]);
      cleanSearchQuery = cleanSearchQuery.replace(rangeMatch[0], '').trim();
    } else {
      if (underMatch) {
        priceFilterFromSearch.max = Number(underMatch[1]);
        cleanSearchQuery = cleanSearchQuery.replace(underMatch[0], '').trim();
      }
      if (overMatch) {
        priceFilterFromSearch.min = Number(overMatch[1]);
        cleanSearchQuery = cleanSearchQuery.replace(overMatch[0], '').trim();
      }
    }

    const getBrandName = (brandId: string) => brands.find(b => b.id === brandId)?.name || '';
    const getCategoryName = (categoryId: string) => categories.find(c => c.id === categoryId)?.name || '';

    let results = products.filter(product => {
      const matchesSearchCategory = !filters.searchCategory || filters.searchCategory === 'all' || product.category === filters.searchCategory;
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesPriceSlider = product.price <= priceRange;

      const brandName = getBrandName(product.brand).toLowerCase();
      const categoryName = getCategoryName(product.category).toLowerCase();

      const matchesTextSearch = cleanSearchQuery.length === 0 ||
        product.name.toLowerCase().includes(cleanSearchQuery) ||
        product.description.toLowerCase().includes(cleanSearchQuery) ||
        brandName.includes(cleanSearchQuery) ||
        categoryName.includes(cleanSearchQuery);
        
      const matchesPriceSearch = product.price >= priceFilterFromSearch.min && product.price <= priceFilterFromSearch.max;

      return matchesSearchCategory && matchesCategory && matchesBrand && matchesPriceSlider && matchesTextSearch && matchesPriceSearch;
    });
    
    switch (sortOrder) {
        case 'price-asc':
            results.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            results.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            results.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            results.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'rating-desc':
            results.sort((a, b) => b.rating - a.rating);
            break;
        case 'best-selling':
            results.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
        case 'featured':
        default:
            break;
    }

    return results;

  }, [products, searchQuery, selectedCategories, selectedBrands, priceRange, sortOrder, brands, categories, filters.searchCategory]);
  
  const suggestedProducts = useMemo(() => {
    if (products.length === 0) return [];
    const primaryCategory = selectedCategories[0] || (filteredProducts[0] && filteredProducts[0].category);
    if (!primaryCategory) return products.slice(10, 14).filter(p => !filteredProducts.some(fp => fp.id === p.id));
    
    return products
      .filter(p => p.category === primaryCategory && !filteredProducts.some(fp => fp.id === p.id))
      .slice(0, 4);
  }, [filteredProducts, selectedCategories, products]);
  
  const getBreadcrumbTitle = () => {
    if (searchQuery) {
        return `Search results for "${searchQuery}"`;
    }
    if (selectedCategories.length === 1) {
        return categories.find(c => c.id === selectedCategories[0])?.name || 'Products';
    }
    if (selectedBrands.length === 1) {
        return brands.find(b => b.id === selectedBrands[0])?.name || 'Products';
    }
    if (initialFilters?.category) {
        return categories.find(c => c.id === initialFilters.category)?.name || 'Products';
    }
    return 'All Products';
  };

  const breadcrumbItems = [
    { name: 'Home', onClick: () => navigateTo('home') },
    { name: getBreadcrumbTitle() },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" checked={selectedCategories.includes(category.id)} onChange={() => handleCategoryChange(category.id)} />
                    <span className="ml-3 text-sm text-gray-600">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Brands</h3>
              <div className="space-y-2">
                {brands.map(brand => (
                  <label key={brand.id} className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" checked={selectedBrands.includes(brand.id)} onChange={() => handleBrandChange(brand.id)} />
                    <span className="ml-3 text-sm text-gray-600">{brand.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Price Range</h3>
              <input type="range" min="50" max="2000" step="50" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <div className="text-sm text-gray-600 mt-2">Up to ${priceRange}</div>
            </div>
            <button onClick={() => { setSelectedCategories([]); setSelectedBrands([]); setPriceRange(2000); setSearchQuery(''); }} className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                Clear Filters
            </button>
          </div>
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="w-full sm:flex-1 relative" ref={searchContainerRef}>
                <input 
                  type="text" 
                  placeholder="Search 'nike under $150'..." 
                  value={searchQuery} 
                  onChange={handleSearchChange} 
                  onFocus={() => setShowSuggestions(suggestions.length > 0)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  autoComplete="off"
                />
                {showSuggestions && suggestions.length > 0 && renderSuggestions()}
            </div>
            <div className="w-full sm:w-auto">
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg shadow-sm p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label="Sort products"
                >
                    <option value="featured">Sort by: Featured</option>
                    <option value="best-selling">Best Selling</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A-Z</option>
                    <option value="name-desc">Name: Z-A</option>
                    <option value="rating-desc">Rating: High to Low</option>
                </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} navigateTo={navigateTo} wishlist={wishlist} handleToggleWishlist={handleToggleWishlist} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700">No Products Found</h2>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </main>
      </div>
      {suggestedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {suggestedProducts.map((product) => (
              <ProductCard key={product.id} product={product} navigateTo={navigateTo} wishlist={wishlist} handleToggleWishlist={handleToggleWishlist} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductListPage;