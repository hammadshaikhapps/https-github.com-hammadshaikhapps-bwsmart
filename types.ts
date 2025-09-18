export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  longDescription: string;
  category: string;
  brand: string;
  imageUrls: string[];
  videoUrl?: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  stockQuantity: number;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export type Page = 'home' | 'plp' | 'pdp' | 'cart' | 'checkout' | 'confirmation' | 'wishlist' | 'admin' | 'help' | 'track' | 'returns' | 'story' | 'careers' | 'press' | 'profile' | 'orderDetails' | 'verify';

export interface PageContext {
  productId?: number;
  category?: string;
  brand?: string;
  searchQuery?: string;
  searchCategory?: string;
  orderId?: string;
  email?: string; // For verification page
}

export interface Suggestion {
  type: 'product' | 'category' | 'brand';
  id: number | string;
  name: string;
}

export interface OrderItem {
    productId: number;
    quantity: number;
    price: number; // Price at the time of purchase
}

export interface Address {
    id: number;
    type: 'Home' | 'Work' | 'Other';
    street: string;
    city: string;
    zip: string;
    isDefault: boolean;
}

export interface PaymentMethod {
    id: number;
    type: 'Credit Card' | 'PayPal';
    provider: string; // e.g., Visa, MasterCard
    last4: string;
    expiry: string;
    isDefault: boolean;
}

export interface Order {
    id: string;
    date: string;
    items: OrderItem[];
    total: number;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    shippingAddress: Address;
    paymentMethod: PaymentMethod;
}

export interface User {
  name: string;
  email: string;
  password?: string; // Storing password is for simulation only
  verified?: boolean;
  phone?: string;
  dob?: string;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
  orders?: Order[];
}