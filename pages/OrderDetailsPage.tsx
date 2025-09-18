import React from 'react';
import type { User, Page, PageContext, Product } from '../types';
import { PRODUCTS } from '../constants'; // To get product details

interface OrderDetailsPageProps {
  orderId: string;
  user: User;
  navigateTo: (page: Page, context?: PageContext) => void;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({ orderId, user, navigateTo }) => {
  const order = user.orders?.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="container mx-auto text-center py-16">
        <h2 className="text-2xl font-semibold">Order not found!</h2>
        <button onClick={() => navigateTo('profile')} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          Back to My Account
        </button>
      </div>
    );
  }

  const getProductDetails = (id: number) => PRODUCTS.find(p => p.id === id);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigateTo('profile')} className="text-orange-600 hover:underline mb-4">&larr; Back to My Orders</button>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Order Details</h1>
            <p className="text-gray-500">Order #{order.id.split('-')[1]} &bull; Placed on {new Date(order.date).toLocaleDateString()}</p>
          </div>
          <p className="text-lg font-semibold">Total: ${order.total.toFixed(2)}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Items in this order</h2>
            <div className="space-y-4">
              {order.items.map(item => {
                const product = getProductDetails(item.productId);
                if (!product) return null;
                return (
                  <div key={item.productId} className="flex items-start gap-4 p-4 border rounded-lg">
                    <img src={product.imageUrls[0]} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                       <button className="px-4 py-2 text-sm bg-orange-100 text-orange-600 font-semibold rounded-lg hover:bg-orange-200">Buy Again</button>
                       <button className="px-4 py-2 text-sm bg-gray-200 font-semibold rounded-lg hover:bg-gray-300">Write a Review</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <address className="not-italic text-gray-700">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
              </address>
            </div>
             <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <p>{order.paymentMethod.provider}</p>
              <p>**** **** **** {order.paymentMethod.last4}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mt-6">
                 <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                 <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Subtotal:</span><span>${(order.total - 5.99).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Shipping:</span><span>$5.99</span></div>
                    <div className="flex justify-between font-bold text-base border-t pt-2 mt-2"><span>Total:</span><span>${order.total.toFixed(2)}</span></div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
