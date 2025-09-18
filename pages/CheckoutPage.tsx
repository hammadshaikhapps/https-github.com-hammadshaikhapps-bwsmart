import React, { useState } from 'react';
import type { CartItem, Product, Page, PageContext } from '../types';

interface CheckoutPageProps {
  cartItems: CartItem[];
  products: Product[];
  navigateTo: (page: Page, context?: PageContext) => void;
  clearCart: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, products, navigateTo, clearCart }) => {
  const [formState, setFormState] = useState({
    name: '', email: '', address: '', city: '', zip: '',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `RCO-${Date.now()}`;
    clearCart();
    navigateTo('confirmation', { orderId });
  };
  
  const getProductDetails = (productId: number) => products.find(p => p.id === productId);

  const subtotal = cartItems.reduce((total, item) => {
    const product = getProductDetails(item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
  
  if (cartItems.length === 0) {
      setTimeout(() => navigateTo('home'), 100);
      return <div className="text-center py-16">Redirecting...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="Full Name" onChange={handleInputChange} required className="p-2 border rounded-md" />
              <input type="email" name="email" placeholder="Email Address" onChange={handleInputChange} required className="p-2 border rounded-md" />
              <input type="text" name="address" placeholder="Street Address" onChange={handleInputChange} required className="p-2 border rounded-md md:col-span-2" />
              <input type="text" name="city" placeholder="City" onChange={handleInputChange} required className="p-2 border rounded-md" />
              <input type="text" name="zip" placeholder="ZIP / Postal Code" onChange={handleInputChange} required className="p-2 border rounded-md" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Payment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="cardName" placeholder="Name on Card" onChange={handleInputChange} required className="p-2 border rounded-md md:col-span-2" />
              <input type="text" name="cardNumber" placeholder="Card Number" onChange={handleInputChange} required className="p-2 border rounded-md md:col-span-2" />
              <input type="text" name="expiry" placeholder="MM/YY" onChange={handleInputChange} required className="p-2 border rounded-md" />
              <input type="text" name="cvv" placeholder="CVV" onChange={handleInputChange} required className="p-2 border rounded-md" />
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Your Order</h2>
            <ul className="space-y-3 mb-4">
                {cartItems.map(item => {
                    const product = getProductDetails(item.productId);
                    if (!product) return null;
                    return (
                        <li key={item.productId} className="flex justify-between text-sm">
                            <span>{product.name} x {item.quantity}</span>
                            <span className="font-semibold">${(product.price * item.quantity).toFixed(2)}</span>
                        </li>
                    )
                })}
            </ul>
            <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>$5.99</span></div>
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${(subtotal + 5.99).toFixed(2)}</span></div>
            </div>
             <button
              type="submit"
              className="w-full mt-6 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CheckoutPage;