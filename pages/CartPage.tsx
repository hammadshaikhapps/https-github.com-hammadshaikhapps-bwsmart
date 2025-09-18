import React, { useMemo } from 'react';
import type { CartItem, Product, Page, PageContext } from '../types';
import ProductCard from '../components/ProductCard';

interface CartPageProps {
  cartItems: CartItem[];
  products: Product[];
  handleUpdateQuantity: (productId: number, newQuantity: number) => void;
  handleRemoveFromCart: (productId: number) => void;
  navigateTo: (page: Page, context?: PageContext) => void;
  wishlist: number[];
  handleToggleWishlist: (productId: number) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, products, handleUpdateQuantity, handleRemoveFromCart, navigateTo, wishlist, handleToggleWishlist }) => {
  const getProductDetails = (productId: number) => products.find(p => p.id === productId);

  const subtotal = cartItems.reduce((total, item) => {
    const product = getProductDetails(item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  const shipping = 5.99;
  const total = subtotal + shipping;

  const suggestedProducts = useMemo(() => {
    if (cartItems.length === 0) return [];
    
    const cartProductIds = cartItems.map(item => item.productId);
    const categoriesInCart = [...new Set(
      cartItems.map(item => getProductDetails(item.productId)?.category).filter(Boolean)
    )];
    
    return products
      .filter(p => !cartProductIds.includes(p.id) && categoriesInCart.includes(p.category))
      .slice(0, 4);

  }, [cartItems, products]);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Your Cart is Empty</h1>
        <p className="text-gray-600 mt-4">Looks like you haven't added anything to your cart yet.</p>
        <button 
          onClick={() => navigateTo('home')}
          className="mt-8 px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md">
            <ul className="divide-y divide-gray-200">
              {cartItems.map(item => {
                const product = getProductDetails(item.productId);
                if (!product) return null;
                return (
                  <li key={item.productId} className="flex items-center p-4">
                    <img src={product.imageUrls?.[0] || 'https://picsum.photos/seed/placeholder/200/200'} alt={product.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                    <div className="flex-grow">
                      <h2 className="font-semibold text-lg">{product.name}</h2>
                      <p className="text-sm text-gray-500">{product.brand}</p>
                      <button onClick={() => handleRemoveFromCart(item.productId)} className="text-red-500 text-sm hover:underline mt-1">Remove</button>
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-lg mx-4">
                      <button onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} className="px-3 py-1 text-lg font-semibold">-</button>
                      <span className="px-3 py-1 text-md">{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)} className="px-3 py-1 text-lg font-semibold">+</button>
                    </div>
                    <div className="text-lg font-semibold w-24 text-right">
                      ${(product.price * item.quantity).toFixed(2)}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => navigateTo('checkout')}
              className="w-full mt-6 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {suggestedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Customers Also Bought</h2>
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

export default CartPage;