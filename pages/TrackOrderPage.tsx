import React, { useState } from 'react';

const TrackOrderPage: React.FC = () => {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [orderStatus, setOrderStatus] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setOrderStatus(null);
        if (!orderId || !email) {
            setError('Please enter both Order ID and Email.');
            return;
        }
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (orderId.toLowerCase() === 'rco-12345' && email.toLowerCase() === 'customer@example.com') {
                setOrderStatus({
                    id: 'RCO-12345',
                    estimatedDelivery: 'June 28, 2024',
                    status: 'Shipped',
                    items: [
                        { name: 'Smartphone Pro X', quantity: 1, imageUrl: 'https://picsum.photos/seed/smartphoneprox/200/200' },
                        { name: 'Wireless Noise-Cancelling Headphones', quantity: 1, imageUrl: 'https://picsum.photos/seed/headphones/200/200' },
                    ],
                    history: [
                        { date: 'June 25, 2024', status: 'Delivered', location: 'Dubai, AE' },
                        { date: 'June 24, 2024', status: 'Out for Delivery', location: 'Dubai, AE' },
                        { date: 'June 23, 2024', status: 'Package arrived at a carrier facility', location: 'Dubai, AE' },
                        { date: 'June 22, 2024', status: 'Shipped', location: 'Origin Facility, US' },
                        { date: 'June 21, 2024', status: 'Order Placed', location: '' },
                    ],
                    currentStep: 3,
                });
            } else {
                setError('Order not found. Please check your details. (Hint: Try Order ID: RCO-12345 and Email: customer@example.com)');
            }
            setIsLoading(false);
        }, 1500);
    };

    const statusSteps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800">Track Your Order</h1>
                    <p className="text-gray-600 mt-2">Enter your order details to see its status.</p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">Order ID</label>
                            <input
                                type="text"
                                id="orderId"
                                value={orderId}
                                onChange={e => setOrderId(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                placeholder="e.g., RCO-12345"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                placeholder="you@example.com"
                            />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Tracking...' : 'Track Order'}
                        </button>
                    </form>
                </div>

                {orderStatus && (
                    <div className="mt-12 bg-white p-8 rounded-lg shadow-lg animate-fade-in">
                        <h2 className="text-2xl font-bold mb-2">Order Status for #{orderStatus.id}</h2>
                        <p className="text-lg font-semibold text-green-600">Estimated Delivery: {orderStatus.estimatedDelivery}</p>

                        <div className="my-8">
                           <div className="flex justify-between items-center">
                                {statusSteps.map((step, index) => (
                                    <React.Fragment key={step}>
                                        <div className="flex flex-col items-center text-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index < orderStatus.currentStep ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                                               {index < orderStatus.currentStep -1 ? '✓' : index + 1}
                                            </div>
                                            <p className={`mt-2 text-sm font-medium ${index < orderStatus.currentStep ? 'text-gray-800' : 'text-gray-500'}`}>{step}</p>
                                        </div>
                                        {index < statusSteps.length - 1 && <div className={`flex-1 h-1 ${index < orderStatus.currentStep - 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>}
                                    </React.Fragment>
                                ))}
                           </div>
                        </div>

                        <h3 className="text-xl font-semibold mb-4 border-t pt-6">Order History</h3>
                        <ul className="space-y-4">
                            {orderStatus.history.map((entry: any, index: number) => (
                                <li key={index} className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-3 h-3 bg-orange-500 rounded-full mt-1.5"></div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-semibold">{entry.status}</p>
                                        <p className="text-sm text-gray-500">{entry.date} {entry.location && `- ${entry.location}`}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

export default TrackOrderPage;
