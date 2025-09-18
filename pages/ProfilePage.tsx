import React, { useState } from 'react';
import type { User, Address, PaymentMethod, Page, PageContext } from '../types';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (updatedData: Partial<User>) => void;
  navigateTo: (page: Page, context?: PageContext) => void;
}

type ActiveSection = 'dashboard' | 'orders' | 'addresses' | 'payments' | 'profile' | 'security';

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, navigateTo }) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardSection user={user} setActiveSection={setActiveSection} />;
      case 'orders': return <OrdersSection user={user} navigateTo={navigateTo} />;
      case 'addresses': return <AddressesSection user={user} onUpdateUser={onUpdateUser} />;
      case 'payments': return <PaymentsSection user={user} onUpdateUser={onUpdateUser} />;
      case 'profile': return <ProfileInfoSection user={user} onUpdateUser={onUpdateUser} />;
      case 'security': return <SecuritySection />;
      default: return <DashboardSection user={user} setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <nav className="bg-white p-4 rounded-lg shadow-md space-y-1">
            <NavItem section="dashboard" activeSection={activeSection} setActiveSection={setActiveSection}>Dashboard</NavItem>
            <NavItem section="orders" activeSection={activeSection} setActiveSection={setActiveSection}>My Orders</NavItem>
            <NavItem section="addresses" activeSection={activeSection} setActiveSection={setActiveSection}>Manage Addresses</NavItem>
            <NavItem section="payments" activeSection={activeSection} setActiveSection={setActiveSection}>Payment Methods</NavItem>
            <NavItem section="profile" activeSection={activeSection} setActiveSection={setActiveSection}>Profile Information</NavItem>
            <NavItem section="security" activeSection={activeSection} setActiveSection={setActiveSection}>Security</NavItem>
          </nav>
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5">
          <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ section: ActiveSection; activeSection: ActiveSection; setActiveSection: (section: ActiveSection) => void; children: React.ReactNode }> = ({ section, activeSection, setActiveSection, children }) => (
  <button
    onClick={() => setActiveSection(section)}
    className={`w-full text-left px-4 py-2 rounded-md text-base font-medium transition-colors ${
      activeSection === section 
        ? 'bg-orange-100 text-orange-600' 
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

// --- SECTIONS ---

const DashboardSection: React.FC<{ user: User, setActiveSection: (section: ActiveSection) => void }> = ({ user, setActiveSection }) => (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Hello, {user.name.split(' ')[0]}!</h2>
        <p className="text-gray-600 mb-8">From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard title="My Orders" onClick={() => setActiveSection('orders')} />
            <DashboardCard title="My Addresses" onClick={() => setActiveSection('addresses')} />
            <DashboardCard title="Profile Details" onClick={() => setActiveSection('profile')} />
        </div>
    </div>
);

const DashboardCard: React.FC<{ title: string; onClick: () => void }> = ({ title, onClick }) => (
    <button onClick={onClick} className="p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md hover:bg-orange-50 transition-all text-left">
        <h3 className="text-xl font-semibold text-gray-800">{title} &rarr;</h3>
    </button>
);


const OrdersSection: React.FC<{ user: User; navigateTo: (page: Page, context?: PageContext) => void }> = ({ user, navigateTo }) => {
    const orders = user.orders || [];
    return (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
        {orders.length === 0 ? (
            <p>You have not placed any orders yet.</p>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-left text-gray-500">
                        <tr>
                            <th className="p-2">Order ID</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Total</th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-t hover:bg-gray-50">
                                <td className="p-2 font-medium">#{order.id.split('-')[1]}</td>
                                <td className="p-2">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="p-2">
                                    <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</span>
                                </td>
                                <td className="p-2">${order.total.toFixed(2)}</td>
                                <td className="p-2 text-right">
                                    <button onClick={() => navigateTo('orderDetails', { orderId: order.id })} className="font-semibold text-orange-600 hover:underline">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
    );
};

const AddressesSection: React.FC<{ user: User; onUpdateUser: (data: Partial<User>) => void }> = ({ user, onUpdateUser }) => {
    // Dummy handler for now
    const handleDelete = (id: number) => {
        const updatedAddresses = user.addresses?.filter(a => a.id !== id);
        onUpdateUser({ addresses: updatedAddresses });
    };
    return (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Addresses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(user.addresses || []).map(address => (
                <div key={address.id} className="p-4 border rounded-lg relative">
                    {address.isDefault && <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Default</span>}
                    <p className="font-semibold">{address.type}</p>
                    <p>{address.street}</p>
                    <p>{address.city}, {address.zip}</p>
                    <div className="mt-4 space-x-4">
                        <button className="text-sm font-semibold text-orange-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(address.id)} className="text-sm font-semibold text-red-600 hover:underline">Delete</button>
                    </div>
                </div>
            ))}
            <button className="p-4 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-500 hover:border-orange-500 hover:text-orange-500 transition-colors">
                + Add New Address
            </button>
        </div>
    </div>
    );
};

const PaymentsSection: React.FC<{ user: User; onUpdateUser: (data: Partial<User>) => void }> = ({ user, onUpdateUser }) => {
    // Dummy handler for now
    const handleDelete = (id: number) => {
        const updatedPayments = user.paymentMethods?.filter(p => p.id !== id);
        onUpdateUser({ paymentMethods: updatedPayments });
    };
    return (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(user.paymentMethods || []).map(payment => (
                <div key={payment.id} className="p-4 border rounded-lg relative">
                    {payment.isDefault && <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Default</span>}
                    <p className="font-semibold">{payment.provider}</p>
                    <p>**** **** **** {payment.last4}</p>
                    <p>Expires {payment.expiry}</p>
                    <div className="mt-4 space-x-4">
                        <button className="text-sm font-semibold text-orange-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(payment.id)} className="text-sm font-semibold text-red-600 hover:underline">Delete</button>
                    </div>
                </div>
            ))}
             <button className="p-4 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-500 hover:border-orange-500 hover:text-orange-500 transition-colors">
                + Add New Payment Method
            </button>
        </div>
    </div>
    );
};

const ProfileInfoSection: React.FC<{ user: User; onUpdateUser: (data: Partial<User>) => void }> = ({ user, onUpdateUser }) => {
    const [formData, setFormData] = useState({ name: user.name, email: user.email, phone: user.phone || '' });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateUser({ name: formData.name, phone: formData.phone });
        alert('Profile updated!');
    };
    
    return (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
             <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 input-field" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" value={formData.email} className="mt-1 input-field bg-gray-100" readOnly />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="mt-1 input-field" />
            </div>
            <button type="submit" className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-sm hover:bg-orange-600">Save Changes</button>
        </form>
         <style>{`.input-field { @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500; }`}</style>
    </div>
    );
};


const SecuritySection: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Password change simulated!');
    };
    return (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
             <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input type="password"  className="mt-1 input-field" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" className="mt-1 input-field" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input type="password" className="mt-1 input-field" />
            </div>
            <button type="submit" className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-sm hover:bg-orange-600">Change Password</button>
        </form>
         <style>{`.input-field { @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500; }`}</style>
    </div>
    );
};


export default ProfilePage;