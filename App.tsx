import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import WishlistPage from './pages/WishlistPage';
import AdminPage from './pages/AdminPage';
import HelpCenterPage from './pages/HelpCenterPage';
import TrackOrderPage from './pages/TrackOrderPage';
import ReturnsRefundsPage from './pages/ReturnsRefundsPage';
import OurStoryPage from './pages/OurStoryPage';
import CareersPage from './pages/CareersPage';
import PressPage from './pages/PressPage';
import ProfilePage from './pages/ProfilePage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import VerifyPage from './pages/VerifyPage';
import SignInModal from './components/SignInModal';
import SignUpModal from './components/SignUpModal';


import type { Page, PageContext, CartItem, Review, Product, Category, User, Order, Address, PaymentMethod } from './types';
import { PRODUCTS as PRODUCTS_DATA, CATEGORIES as CATEGORIES_DATA, BRANDS as BRANDS_DATA } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentPageContext, setCurrentPageContext] = useState<PageContext | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [reviews, setReviews] = useState<Record<number, Review[]>>({});
  
  const [products, setProducts] = useState(PRODUCTS_DATA);
  const [categories, setCategories] = useState(CATEGORIES_DATA);
  const [brands, setBrands] = useState(BRANDS_DATA);

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const storedUsers = localStorage.getItem('users');
      return storedUsers ? JSON.parse(storedUsers) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<'signIn' | 'signUp' | null>(null);
  
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const storedWishlist = localStorage.getItem('wishlist');
      return storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    try {
        const storedUserEmail = localStorage.getItem('currentUserEmail');
        if (storedUserEmail) {
            const user = users.find(u => u.email === storedUserEmail);
            if (user) {
                setCurrentUser(user);
            }
        }
    } catch (error) {
        console.error("Failed to load current user from localStorage", error);
    }
  }, [users]);

  const navigateTo = useCallback((page: Page, context: PageContext | null = null) => {
    setCurrentPage(page);
    setCurrentPageContext(context);
    window.scrollTo(0, 0);
  }, []);
  
  const handleSignIn = (email: string, password: string):string => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return "No account found with that email.";
    if (user.password !== password) return "Incorrect password.";
    if (!user.verified) return "Account not verified. Please check your email.";
    
    setCurrentUser(user);
    localStorage.setItem('currentUserEmail', user.email);
    setShowAuthModal(null);
    return "SUCCESS";
  };

  const handleSignUp = (newUser: User): string => {
    if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
        return "An account with this email already exists.";
    }

    const userToSave: User = {
        ...newUser,
        verified: false,
        addresses: [],
        paymentMethods: [],
        orders: []
    };
    
    setUsers(prev => [...prev, userToSave]);
    setShowAuthModal(null);
    navigateTo('verify', { email: newUser.email });
    return "SUCCESS";
  };

  const handleVerifyAccount = (email: string) => {
    let verifiedUser: User | null = null;
    setUsers(prevUsers => prevUsers.map(user => {
        if (user.email.toLowerCase() === email.toLowerCase()) {
            verifiedUser = { ...user, verified: true };
            return verifiedUser;
        }
        return user;
    }));
    
    if (verifiedUser) {
        setCurrentUser(verifiedUser);
        localStorage.setItem('currentUserEmail', verifiedUser.email);
        navigateTo('profile');
    }
  };


  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserEmail');
    navigateTo('home');
  };
  
  const handleUpdateUser = (updatedUserData: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedUserData };
    setCurrentUser(updatedUser);
    setUsers(prevUsers => prevUsers.map(u => u.email === currentUser.email ? updatedUser : u));
  };


  const handleAddToCart = (productId: number, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.productId === productId);
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        const existingItem = updatedCart[existingItemIndex];
        updatedCart[existingItemIndex] = { ...existingItem, quantity: existingItem.quantity + quantity };
        return updatedCart;
      } else {
        return [...prevCart, { productId, quantity }];
      }
    });
    alert(`${quantity}x "${product.name}" added to cart!`);
  };

  const handleBuyNow = (productId: number, quantity: number) => {
    setCart([{ productId, quantity }]);
    navigateTo('checkout');
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const handleRemoveFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };
  
  const clearCart = () => setCart([]);
  
  const handleAddReview = (productId: number, reviewData: { userName: string; rating: number; comment: string; }) => {
      const newReview: Review = {
        id: Date.now(),
        ...reviewData,
        date: new Date().toISOString(),
      };
      setReviews(prevReviews => ({
        ...prevReviews,
        [productId]: [...(prevReviews[productId] || []), newReview]
      }));
    };
    
  const handleToggleWishlist = (productId: number) => {
    setWishlist(prevWishlist => 
      prevWishlist.includes(productId) 
        ? prevWishlist.filter(id => id !== productId)
        : [...prevWishlist, productId]
    );
  };

  // --- Admin CRUD Functions ---
  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'reviews'>) => {
    setProducts(prev => [...prev, {
        ...newProductData,
        id: Date.now(),
        rating: 0,
        reviewCount: 0,
        reviews: [],
    }]);
    alert(`Product "${newProductData.name}" added successfully!`);
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(item => item.productId !== productId));
    setWishlist(prev => prev.filter(id => id !== productId));
  };

  const handleAddCategory = (newCategoryData: Omit<Category, 'id'>) => {
    const newId = newCategoryData.name.toLowerCase().replace(/\s+/g, '-');
    if (categories.some(c => c.id === newId)) {
        alert("A category with this name already exists.");
        return;
    }
    setCategories(prev => [...prev, { ...newCategoryData, id: newId }]);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setProducts(prev => prev.filter(p => p.category !== categoryId));
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const handleUpdateCategory = (categoryId: string, newName: string) => {
    setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, name: newName } : c));
  };


  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const renderPage = () => {
    const protectedPages: Page[] = ['profile', 'orderDetails', 'checkout'];
    if (protectedPages.includes(currentPage) && !currentUser) {
        // Redirect to home and show sign-in modal for protected pages
        setTimeout(() => {
          navigateTo('home');
          setShowAuthModal('signIn');
        }, 100);
        return <div className="text-center py-16">Please sign in to continue.</div>;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage products={products} categories={categories} navigateTo={navigateTo} wishlist={wishlist} handleToggleWishlist={handleToggleWishlist} />;
      case 'plp':
        return <ProductListPage products={products} categories={categories} brands={brands} navigateTo={navigateTo} initialFilters={currentPageContext || {}} wishlist={wishlist} handleToggleWishlist={handleToggleWishlist} />;
      case 'pdp':
        if (currentPageContext?.productId) {
          return <ProductDetailPage 
            productId={currentPageContext.productId}
            products={products}
            categories={categories}
            handleAddToCart={handleAddToCart} 
            handleBuyNow={handleBuyNow}
            navigateTo={navigateTo}
            reviews={reviews[currentPageContext.productId] || []}
            handleAddReview={handleAddReview} 
            wishlist={wishlist}
            handleToggleWishlist={handleToggleWishlist}
            currentUser={currentUser}
          />;
        }
        return <HomePage products={products} categories={categories} navigateTo={navigateTo} wishlist={wishlist} handleToggleWishlist={handleToggleWishlist} />;
      case 'cart':
        return <CartPage cartItems={cart} products={products} handleUpdateQuantity={handleUpdateQuantity} handleRemoveFromCart={handleRemoveFromCart} navigateTo={navigateTo} wishlist={wishlist} handleToggleWishlist={handleToggleWishlist} />;
      case 'wishlist':
        return <WishlistPage wishlist={wishlist} products={products} navigateTo={navigateTo} handleToggleWishlist={handleToggleWishlist} />;
      case 'checkout':
        return <CheckoutPage cartItems={cart} products={products} navigateTo={navigateTo} clearCart={clearCart}/>;
      case 'confirmation':
          return <ConfirmationPage context={currentPageContext || {}} navigateTo={navigateTo} />;
      case 'admin':
          return <AdminPage 
            products={products}
            categories={categories}
            brands={brands}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onUpdateCategory={handleUpdateCategory}
            />;
      case 'help':
        return <HelpCenterPage navigateTo={navigateTo} />;
      case 'track':
        return <TrackOrderPage />;
      case 'returns':
        return <ReturnsRefundsPage navigateTo={navigateTo} />;
      case 'story':
        return <OurStoryPage />;
      case 'careers':
        return <CareersPage />;
      case 'press':
        return <PressPage />;
      case 'profile':
        return <ProfilePage user={currentUser!} onUpdateUser={handleUpdateUser} navigateTo={navigateTo} />;
      case 'orderDetails':
        return <OrderDetailsPage orderId={currentPageContext?.orderId || ''} user={currentUser!} navigateTo={navigateTo} />;
      case 'verify':
        return <VerifyPage email={currentPageContext?.email || ''} onVerify={handleVerifyAccount} />;
      default:
        return <HomePage products={products} categories={categories} navigateTo={navigateTo} wishlist={wishlist} handleToggleWishlist={handleToggleWishlist} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SignInModal
        isOpen={showAuthModal === 'signIn'}
        onClose={() => setShowAuthModal(null)}
        onSignIn={handleSignIn}
        onSwitchToSignUp={() => setShowAuthModal('signUp')}
      />
      <SignUpModal
        isOpen={showAuthModal === 'signUp'}
        onClose={() => setShowAuthModal(null)}
        onSignUp={handleSignUp}
        onSwitchToSignIn={() => setShowAuthModal('signIn')}
      />
      <Header
        cartItemCount={cartItemCount}
        wishlistItemCount={wishlist.length}
        navigateTo={navigateTo}
        products={products}
        categories={categories}
        brands={brands}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onSignInClick={() => setShowAuthModal('signIn')}
        onSignUpClick={() => setShowAuthModal('signUp')}
      />
      <main className="flex-grow pt-4">
        {renderPage()}
      </main>
      <Footer navigateTo={navigateTo} />
    </div>
  );
};

export default App;