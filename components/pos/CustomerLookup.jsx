import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  User,
  Phone,
  Mail,
  Plus,
  Star,
  Gift,
  CreditCard,
  MapPin,
  Calendar,
  X,
  UserPlus,
  Crown
} from 'lucide-react';

const CustomerLookup = ({ onCustomerSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      emirate: '',
      country: 'UAE'
    },
    preferences: {
      language: 'en',
      communication: 'sms'
    }
  });

  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchCustomers();
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/customers?include=loyalty');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers.slice(0, 20)); // Show first 20
      return;
    }

    const search = searchTerm.toLowerCase();
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(search) ||
      customer.phone.includes(search) ||
      customer.email?.toLowerCase().includes(search) ||
      customer.loyaltyNumber?.toLowerCase().includes(search)
    );

    setFilteredCustomers(filtered.slice(0, 20));
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  const confirmSelection = () => {
    if (selectedCustomer) {
      onCustomerSelect(selectedCustomer);
      onClose();
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Validate required fields
      if (!newCustomer.name || !newCustomer.phone) {
        alert('Name and phone number are required');
        return;
      }

      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newCustomer,
          source: 'pos',
          createdAt: new Date()
        })
      });

      if (response.ok) {
        const createdCustomer = await response.json();
        setCustomers([createdCustomer.customer, ...customers]);
        setSelectedCustomer(createdCustomer.customer);
        setShowNewCustomerForm(false);
        setNewCustomer({
          name: '',
          phone: '',
          email: '',
          dateOfBirth: '',
          address: {
            street: '',
            city: '',
            emirate: '',
            country: 'UAE'
          },
          preferences: {
            language: 'en',
            communication: 'sms'
          }
        });
      } else {
        const error = await response.json();
        alert(`Error creating customer: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Failed to create customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'diamond':
        return <Crown className="w-4 h-4 text-purple-600" />;
      case 'platinum':
        return <Star className="w-4 h-4 text-gray-600" />;
      case 'gold':
        return <Star className="w-4 h-4 text-yellow-600" />;
      case 'silver':
        return <Star className="w-4 h-4 text-gray-400" />;
      default:
        return <User className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'diamond':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'platinum':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const CustomerCard = ({ customer, isSelected, onClick }) => (
    <div
      onClick={onClick}
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900">{customer.name}</h3>
            {customer.loyalty?.tier && (
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getTierColor(customer.loyalty.tier)}`}>
                {getTierIcon(customer.loyalty.tier)}
                <span>{customer.loyalty.tier.toUpperCase()}</span>
              </div>
            )}
          </div>

          <div className="space-y-1 text-sm text-gray-600">
            {customer.phone && (
              <div className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>{customer.phone}</span>
              </div>
            )}
            {customer.email && (
              <div className="flex items-center space-x-1">
                <Mail className="w-3 h-3" />
                <span>{customer.email}</span>
              </div>
            )}
            {customer.address?.city && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{customer.address.city}, {customer.address.emirate || customer.address.country}</span>
              </div>
            )}
          </div>

          {customer.loyalty && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Gift className="w-3 h-3 text-orange-500" />
                    <span className="text-gray-600">Points:</span>
                    <span className="font-medium text-orange-600">
                      {customer.loyalty.points?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CreditCard className="w-3 h-3 text-green-500" />
                    <span className="text-gray-600">Spent:</span>
                    <span className="font-medium text-green-600">
                      AED {customer.loyalty.totalSpent?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
                {customer.loyalty.totalTransactions > 0 && (
                  <span className="text-xs text-gray-500">
                    {customer.loyalty.totalTransactions} visits
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const NewCustomerForm = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">New Customer</h3>
        <button
          onClick={() => setShowNewCustomerForm(false)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleCreateCustomer} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={newCustomer.email}
            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={newCustomer.dateOfBirth}
            onChange={(e) => setNewCustomer({ ...newCustomer, dateOfBirth: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={newCustomer.address.city}
              onChange={(e) => setNewCustomer({
                ...newCustomer,
                address: { ...newCustomer.address, city: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emirate
            </label>
            <select
              value={newCustomer.address.emirate}
              onChange={(e) => setNewCustomer({
                ...newCustomer,
                address: { ...newCustomer.address, emirate: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Emirate</option>
              <option value="Abu Dhabi">Abu Dhabi</option>
              <option value="Dubai">Dubai</option>
              <option value="Sharjah">Sharjah</option>
              <option value="Ajman">Ajman</option>
              <option value="Umm Al Quwain">Umm Al Quwain</option>
              <option value="Ras Al Khaimah">Ras Al Khaimah</option>
              <option value="Fujairah">Fujairah</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={() => setShowNewCustomerForm(false)}
            className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
          >
            {loading ? 'Creating...' : 'Create Customer'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Select Customer</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {!showNewCustomerForm && (
            <div className="mt-4 flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, phone, email, or loyalty number..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowNewCustomerForm(true)}
                className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>New Customer</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {showNewCustomerForm ? (
            <div className="p-6">
              <NewCustomerForm />
            </div>
          ) : (
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading customers...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {filteredCustomers.length === 0 ? (
                    <div className="col-span-2 text-center py-12 text-gray-500">
                      {searchTerm ? 'No customers found matching your search.' : 'No customers available.'}
                      <div className="mt-4">
                        <button
                          onClick={() => setShowNewCustomerForm(true)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          Create New Customer
                        </button>
                      </div>
                    </div>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <CustomerCard
                        key={customer._id}
                        customer={customer}
                        isSelected={selectedCustomer?._id === customer._id}
                        onClick={() => handleCustomerSelect(customer)}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!showNewCustomerForm && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {selectedCustomer ? (
                  <span>Selected: <strong>{selectedCustomer.name}</strong></span>
                ) : (
                  'Select a customer to continue'
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSelection}
                  disabled={!selectedCustomer}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                >
                  Select Customer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerLookup;