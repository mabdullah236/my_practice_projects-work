import React, { useState, useEffect } from 'react';
import { Check, CreditCard, Star, RotateCcw } from 'lucide-react';
import PaymentModal from '../../components/features/PaymentModal';

const BillingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('upgrade');
  const [selectedPlanToUpgrade, setSelectedPlanToUpgrade] = useState('');
  
  // Initialize state from LocalStorage to fix refresh issue
  const [currentPlanName, setCurrentPlanName] = useState(() => {
    return localStorage.getItem('userPlan') || 'Free Starter';
  });

  // Save to LocalStorage whenever plan changes
  useEffect(() => {
    localStorage.setItem('userPlan', currentPlanName);
  }, [currentPlanName]);

  const plans = [
    {
      name: 'Free Starter',
      price: '$0',
      features: ['500 Words/mo', 'Standard Speed', '2 Languages'],
    },
    {
      name: 'Pro Professional',
      price: '$29',
      features: ['Unlimited Words', 'Fast Speed', 'All 50+ Languages', 'Priority Support'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      features: ['Custom Models', 'API Access', 'Dedicated Manager', 'SLA Agreement'],
    },
  ];

  const handleUpgradeClick = (planName) => {
    setModalMode('upgrade');
    setSelectedPlanToUpgrade(planName);
    setIsModalOpen(true);
  };

  const handleEditCard = () => {
    setModalMode('edit');
    setSelectedPlanToUpgrade('');
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = (newPlanName) => {
    if (modalMode === 'upgrade') {
      setCurrentPlanName(newPlanName);
    }
    alert(modalMode === 'upgrade' ? `Successfully upgraded to ${newPlanName}!` : "Payment Method Updated!");
  };

  // Reset for Demo purposes
  const resetDemo = () => {
    localStorage.removeItem('userPlan');
    setCurrentPlanName('Free Starter');
    window.location.reload();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        mode={modalMode} 
        planName={selectedPlanToUpgrade}
        onSuccess={handlePaymentSuccess} 
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription & Billing</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your global subscription plan.</p>
        </div>
        <button onClick={resetDemo} className="text-xs text-gray-400 hover:text-gray-600 flex items-center mt-2 md:mt-0">
          <RotateCcw size={12} className="mr-1"/> Reset Demo Data
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isActive = plan.name === currentPlanName;
          
          return (
            <div 
              key={plan.name} 
              className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border relative transition hover:-translate-y-1 
                ${isActive ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-100 dark:border-gray-700'}`}
            >
              {isActive && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  CURRENT PLAN
                </span>
              )}
              {plan.popular && !isActive && (
                <span className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg flex items-center">
                   <Star size={10} className="mr-1 fill-current" /> POPULAR
                </span>
              )}
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
              <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="ml-1 text-xl font-semibold text-gray-500">/mo</span>
              </div>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex">
                    <Check className="flex-shrink-0 w-5 h-5 text-green-500" />
                    <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => !isActive && handleUpgradeClick(plan.name)}
                disabled={isActive}
                className={`mt-8 w-full py-2 px-4 rounded-lg font-medium transition ${
                  isActive 
                    ? 'bg-gray-100 text-green-700 cursor-default dark:bg-gray-700 dark:text-green-400 border border-green-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                }`}
              >
                {isActive ? 'Active Plan' : 'Upgrade Now'}
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Payment Method Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Payment Method</h3>
        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-md border border-gray-200 shadow-sm">
              <CreditCard className="text-blue-600 h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-gray-900 dark:text-white">Visa ending in 4242</p>
              <p className="text-xs text-gray-500">Expires 12/2025 • Default</p>
            </div>
          </div>
          <button onClick={handleEditCard} className="text-blue-600 text-sm font-semibold hover:bg-blue-50 px-3 py-1 rounded transition">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;