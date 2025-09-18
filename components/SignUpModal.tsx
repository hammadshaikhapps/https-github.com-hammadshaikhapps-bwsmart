import React, { useState, useEffect } from 'react';
import type { User } from '../types';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: (user: User) => string;
  onSwitchToSignIn: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, onSignUp, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    agreedToTerms: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!formData.agreedToTerms) {
      setError('You must agree to the Terms of Service.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
        const result = onSignUp({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
        });
        if (result !== "SUCCESS") {
            setError(result);
        }
        setIsLoading(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl p-8 max-w-xl w-full relative animate-fade-in-up max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
        
        <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50">
            <img src="https://www.google.com/favicon.ico" alt="Google icon" className="w-6 h-6" />
            Continue with Google
        </button>
        
        <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="fullName" onChange={handleChange} className="mt-1 block w-full input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" name="email" onChange={handleChange} className="mt-1 block w-full input-field" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" onChange={handleChange} className="mt-1 block w-full input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input type="password" name="confirmPassword" onChange={handleChange} className="mt-1 block w-full input-field" required />
            </div>
          </div>
          
          <div className="pt-2">
            <label className="flex items-start">
                <input type="checkbox" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 mt-0.5" />
                <span className="ml-2 text-sm text-gray-600">I agree to the <a href="#" className="text-orange-600 hover:underline">Terms of Service</a> and <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>.</span>
            </label>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={onSwitchToSignIn} className="font-medium text-orange-600 hover:underline">
            Sign In
          </button>
        </p>
      </div>
      <style>{`
        .input-field {
            @apply px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500;
        }
        .animate-fade-in-up { 
            animation: fadeInUp 0.3s ease-out; 
        } 
        @keyframes fadeInUp { 
            from { opacity: 0; transform: translateY(20px); } 
            to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
};

export default SignUpModal;