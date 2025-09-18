import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Product, Page, PageContext, Review, Category, User } from '../types';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { ICONS } from '../constants';

interface ProductDetailPageProps {
  productId: number;
  products: Product[];
  categories: Category[];
  handleAddToCart: (productId: number, quantity: number) => void;
  handleBuyNow: (productId: number, quantity: number) => void;
  navigateTo: (page: Page, context?: PageContext) => void;
  reviews: Review[];
  handleAddReview: (productId: number, review: { userName: string; rating: number; comment: string }) => void;
  wishlist: number[];
  handleToggleWishlist: (productId: number) => void;
  currentUser: User | null;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ 
  productId, products, categories, handleAddToCart, handleBuyNow, navigateTo, reviews, handleAddReview, wishlist, handleToggleWishlist, currentUser
}) => {
  const [quantity, setQuantity] = useState(1);
  const [newReviewName, setNewReviewName] = useState(currentUser?.name || '');
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [ratingHover, setRatingHover] = useState(0);
  const [reviewError, setReviewError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const product = products.find(p => p.id === productId);

  const [mainMediaUrl, setMainMediaUrl] = useState(product?.imageUrls?.[0] || '');
  const [zoom, setZoom] = useState({ active: false, x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const LOUPE_SIZE = 250; // Increased loupe size
  const ZOOM_LEVEL = 2.5;

  useEffect(() => {
    if (currentUser) {
      setNewReviewName(currentUser.name);
    }
  }, [currentUser]);

  useEffect(() => {
    if (product) {
      setMainMediaUrl(product.imageUrls?.[0] || '');
      setQuantity(product.stockQuantity > 0 ? 1 : 0);
      setZoom({ active: false, x: 0, y: 0 }); // Reset zoom on product change
    }
  }, [product]);

  const getEmbedUrl = (url?: string): string => {
    if (!url) return '';
    if (url.startsWith('blob:')) return url;
    
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    return url;
  };

  const videoEmbedUrl = useMemo(() => getEmbedUrl(product?.videoUrl), [product?.videoUrl]);
  const isUploadedVideo = (url: string) => url.startsWith('blob:');
  const isVideo = useMemo(() => isUploadedVideo(mainMediaUrl) || mainMediaUrl.includes('youtube.com/embed'), [mainMediaUrl]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setZoom(prev => ({ ...prev, x, y }));
  };

  const category = categories.find(c => c.id === product?.category);

  const breadcrumbItems = [
    { name: 'Home', onClick: () => navigateTo('home') },
    ...(category ? [{ name: category.name, onClick: () => navigateTo('plp', { category: category.id }) }] : []),
    ...(product ? [{ name: product.name }] : []),
  ];

  if (!product) {
    return (
        <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">Product not found!</h2>
            <button onClick={() => navigateTo('home')} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                Go to Homepage
            </button>
        </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  
  const getStockStatus = () => {
    if (product.stockQuantity === 0) {
      return { text: 'Out of Stock', className: 'text-red-500' };
    }
    if (product.stockQuantity <= 10) {
      return { text: `Low Stock: Only ${product.stockQuantity} left!`, className: 'text-orange-500' };
    }
    return { text: 'In Stock', className: 'text-green-600' };
  };

  const stockStatus = getStockStatus();

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    if (newReviewName.trim() && newReviewRating > 0 && newReviewComment.trim()) {
      handleAddReview(product.id, {
        userName: newReviewName,
        rating: newReviewRating,
        comment: newReviewComment,
      });
      setNewReviewName(currentUser?.name || '');
      setNewReviewRating(0);
      setNewReviewComment('');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } else {
      setReviewError('Please fill out all fields and select a rating.');
    }
  };

  const allReviews = [...(product.reviews || []), ...reviews];
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div 
                ref={imageContainerRef}
                onMouseEnter={() => !isVideo && setZoom(prev => ({ ...prev, active: true }))}
                onMouseLeave={() => !isVideo && setZoom(prev => ({ ...prev, active: false }))}
                onMouseMove={handleMouseMove}
                className={`relative w-full aspect-square rounded-lg shadow-md overflow-hidden bg-gray-100 ${product.stockQuantity === 0 ? 'grayscale' : ''} ${!isVideo ? 'cursor-crosshair' : ''}`}
              >
                {isVideo ? (
                  isUploadedVideo(mainMediaUrl) ? (
                    <video src={mainMediaUrl} controls className="w-full h-full object-cover"></video>
                  ) : (
                     <iframe src={mainMediaUrl} title={product.name} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                  )
                ) : (
                  <>
                    <img src={mainMediaUrl || 'https://picsum.photos/seed/placeholder/600/600'} alt={product.name} className="w-full h-full object-cover transition-opacity duration-300" style={{ opacity: zoom.active ? 0.7 : 1 }} loading="lazy" />
                    <div
                      style={{
                        top: `${zoom.y - LOUPE_SIZE / 2}px`,
                        left: `${zoom.x - LOUPE_SIZE / 2}px`,
                        width: `${LOUPE_SIZE}px`,
                        height: `${LOUPE_SIZE}px`,
                        backgroundImage: `url(${mainMediaUrl})`,
                        backgroundSize: `${(imageContainerRef.current?.clientWidth || 0) * ZOOM_LEVEL}px ${(imageContainerRef.current?.clientHeight || 0) * ZOOM_LEVEL}px`,
                        backgroundPosition: `-${zoom.x * ZOOM_LEVEL - LOUPE_SIZE / 2}px -${zoom.y * ZOOM_LEVEL - LOUPE_SIZE / 2}px`,
                        backgroundRepeat: 'no-repeat',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                      }}
                      className={`absolute border-4 border-white rounded-full pointer-events-none transition-all duration-200 ease-out ${
                        zoom.active ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                      }`}
                    />
                  </>
                )}
            </div>
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {product.imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Thumbnail ${index + 1}`} onClick={() => setMainMediaUrl(url)} className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${mainMediaUrl === url ? 'border-orange-500' : 'border-transparent hover:border-gray-400'}`} />
              ))}
              {videoEmbedUrl && (
                <div onClick={() => setMainMediaUrl(videoEmbedUrl)} className={`w-20 h-20 flex-shrink-0 rounded-md cursor-pointer border-2 ${mainMediaUrl === videoEmbedUrl ? 'border-orange-500' : 'border-transparent hover:border-gray-400'} flex items-center justify-center bg-gray-200`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                </div>
              )}
            </div>
          </div>

          <div>
            <span className="text-sm text-gray-500">{product.brand}</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mt-2">{product.name}</h1>
            <div className="mt-4">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
            </div>
            <p className="text-gray-600 mt-4 text-base">{product.longDescription}</p>
            <p className="text-4xl font-extrabold text-orange-500 mt-6">${product.price.toFixed(2)}</p>
            
            <div className="mt-4">
              <p className={`text-lg font-semibold ${stockStatus.className}`}>{stockStatus.text}</p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                  className="px-4 py-2 text-lg font-semibold disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={product.stockQuantity === 0 || quantity <= 1}
                >
                  -
                </button>
                <span className={`px-4 py-2 text-lg ${product.stockQuantity === 0 ? 'text-gray-400' : ''}`}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))} 
                  className="px-4 py-2 text-lg font-semibold disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={product.stockQuantity === 0 || quantity >= product.stockQuantity}
                >
                  +
                </button>
              </div>
              <div className="w-full sm:flex-1 flex flex-col sm:flex-row gap-4">
                 <button 
                    onClick={() => handleAddToCart(product.id, quantity)}
                    className="w-full sm:flex-1 px-6 py-3 bg-orange-100 text-orange-600 font-semibold rounded-lg shadow-sm hover:bg-orange-200 border border-orange-200 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                    disabled={product.stockQuantity === 0}
                  >
                    {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => handleBuyNow(product.id, quantity)}
                    className="w-full sm:flex-1 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={product.stockQuantity === 0}
                  >
                    Buy Now
                  </button>
              </div>
              <button
                onClick={() => handleToggleWishlist(product.id)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-lg shadow-md transition-colors ${
                  isWishlisted 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {isWishlisted ? ICONS.heartFull : ICONS.heartOutline}
                <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="reviewName" className="block text-sm font-medium text-gray-700">Your Name</label>
                            <input 
                                type="text" 
                                id="reviewName" 
                                value={newReviewName} 
                                onChange={e => setNewReviewName(e.target.value)} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100" 
                                required 
                                readOnly={!!currentUser}
                                disabled={!!currentUser}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Rating</label>
                            <div className="flex items-center mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button 
                                        type="button" 
                                        key={star} 
                                        className="focus:outline-none" 
                                        onClick={() => setNewReviewRating(star)} 
                                        onMouseEnter={() => setRatingHover(star)} 
                                        onMouseLeave={() => setRatingHover(0)}
                                    >
                                        {React.cloneElement(star <= (ratingHover || newReviewRating) ? ICONS.starFull : ICONS.starEmpty, { className: 'h-6 w-6' })}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="reviewComment" className="block text-sm font-medium text-gray-700">Comment</label>
                            <textarea id="reviewComment" value={newReviewComment} onChange={e => setNewReviewComment(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" required></textarea>
                        </div>
                        <button type="submit" className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600">Submit Review</button>
                        {reviewError && <p className="text-red-500 text-sm mt-2">{reviewError}</p>}
                        {showSuccessMessage && <p className="text-green-600 text-sm mt-2">Thank you! Your review has been submitted.</p>}
                    </form>
                </div>
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4">
                    {allReviews.length > 0 ? allReviews.map(review => (
                        <div key={review.id} className="border-b pb-4">
                            <div className="flex justify-between items-center">
                                <StarRating rating={review.rating} />
                                {review.date && <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>}
                            </div>
                            <p className="font-semibold mt-2">{review.userName}</p>
                            <p className="text-gray-600 mt-1">{review.comment}</p>
                        </div>
                    )) : <p className="text-gray-500">Be the first to review this product!</p>}
                </div>
            </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} navigateTo={navigateTo} wishlist={wishlist} handleToggleWishlist={handleToggleWishlist} />)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;