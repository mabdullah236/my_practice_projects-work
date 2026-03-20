import React, { useState, useEffect, useRef } from 'react';
import { X, CreditCard, Lock, ShieldCheck, MapPin, ChevronDown, Search, Loader2 } from 'lucide-react';
import api from '../../api/client'; // Agar api client setup hai to use karein, warna fetch

const PaymentModal = ({ isOpen, onClose, mode, planName, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});

  // API Data State
  const [countriesList, setCountriesList] = useState([]); 
  const [isFetchingCountries, setIsFetchingCountries] = useState(true);

  // Dropdown States
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    country: 'Select Country',
    address: '',
    city: '',
    zip: ''
  });

  // Fetch Countries from Backend
  useEffect(() => {
    if (isOpen) { 
      setIsFetchingCountries(true);
      // Backend se data mangwa rahay hain
      fetch('http://localhost:8000/api/v1/utils/countries')
        .then(response => response.json())
        .then(data => {
          setCountriesList(data);
          setIsFetchingCountries(false);
        })
        .catch(error => {
          console.error("Error fetching countries:", error);
          // Fallback agar backend band ho
          setCountriesList(["United States", "Pakistan", "United Kingdom", "Canada", "Germany", "Australia"]);
          setIsFetchingCountries(false);
        });
    }
  }, [isOpen]);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // --- Auto Formatting Logic ---
  const handleCardChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); 
    val = val.substring(0, 16); 
    val = val.replace(/(\d{4})/g, '$1 ').trim(); 
    setFormData(prev => ({ ...prev, cardNumber: val }));
    if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: '' }));
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); 
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4); 
    }
    val = val.substring(0, 5); 
    setFormData(prev => ({ ...prev, expiry: val }));
    if (errors.expiry) setErrors(prev => ({ ...prev, expiry: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Filter Logic
  const filteredCountries = countriesList.filter(c => 
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      alert("Please agree to the Terms & Conditions.");
      return;
    }
    if (formData.country === 'Select Country') {
        alert("Please select a valid country.");
        return;
    }

    setLoading(true);
    // Payment Simulation
    setTimeout(() => {
      setLoading(false);
      onSuccess(planName); // Update parent
      onClose();
      setFormData({ cardNumber: '', expiry: '', cvc: '', name: '', country: 'Select Country', address: '', city: '', zip: '' });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {mode === 'upgrade' ? `Confirm Subscription` : 'Update Card Details'}
            </h3>
            {mode === 'upgrade' && <p className="text-sm text-blue-600 font-medium">Upgrading to {planName}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 custom-scrollbar">
          <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Payment Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center">
                <CreditCard size={16} className="mr-2" /> Payment Details
              </h4>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Card Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.cardNumber}
                    onChange={handleCardChange}
                    placeholder="0000 0000 0000 0000" 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                  <CreditCard className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Expiry (MM/YY)</label>
                  <input 
                    type="text" 
                    value={formData.expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">CVC</label>
                  <div className="relative">
                    <input 
                      name="cvc" value={formData.cvc} onChange={handleChange}
                      type="text" placeholder="123" maxLength="4"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                    <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Cardholder Name</label>
                <input 
                  name="name" value={formData.name} onChange={handleChange}
                  type="text" placeholder="John Doe" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-700" />

            {/* Address Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center">
                <MapPin size={16} className="mr-2" /> Billing Address
              </h4>

              <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2 relative" ref={dropdownRef}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Country / Region</label>
                    
                    {/* Trigger Input */}
                    <div 
                      className="relative cursor-pointer" 
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    >
                      <input 
                        type="text" 
                        readOnly 
                        value={formData.country} 
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none"
                      />
                      <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={18} />
                    </div>

                    {/* Custom Searchable Dropdown */}
                    {showCountryDropdown && (
                      <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-60 flex flex-col">
                        <div className="p-2 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                          <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                            <input 
                              type="text" 
                              autoFocus
                              placeholder="Search country..." 
                              className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto custom-scrollbar flex-1">
                          {isFetchingCountries ? (
                             <div className="p-4 text-center text-gray-500 flex items-center justify-center">
                                <Loader2 className="animate-spin mr-2" size={16} /> Loading...
                             </div>
                          ) : (
                              <>
                                {filteredCountries.map((country) => (
                                    <div 
                                    key={country}
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, country }));
                                        setShowCountryDropdown(false);
                                        setCountrySearch("");
                                    }}
                                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:text-gray-200 ${formData.country === country ? 'bg-blue-50 text-blue-600 font-bold' : ''}`}
                                    >
                                    {country}
                                    </div>
                                ))}
                                {filteredCountries.length === 0 && (
                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">No country found</div>
                                )}
                              </>
                          )}
                        </div>
                      </div>
                    )}
                 </div>

                 <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Street Address</label>
                    <input name="address" value={formData.address} onChange={handleChange} type="text" placeholder="123 Main St" className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                 </div>

                 <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                    <input name="city" value={formData.city} onChange={handleChange} type="text" placeholder="Lahore" className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Zip Code</label>
                    <input name="zip" value={formData.zip} onChange={handleChange} type="text" placeholder="54000" className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                 </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start pt-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              <input id="terms" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 mr-3 h-4 w-4 text-blue-600 rounded cursor-pointer" />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                I agree to the <span className="text-blue-600 underline">Terms of Service</span>. 
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
          <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-bold">
            <ShieldCheck size={16} className="mr-1" /> SSL Encrypted
          </div>
          <button type="submit" form="payment-form" disabled={loading} className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 shadow-lg">
            {loading ? 'Processing...' : (mode === 'upgrade' ? `Pay & Upgrade` : 'Save Changes')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;