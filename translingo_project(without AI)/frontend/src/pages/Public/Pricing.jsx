import React from 'react';
import { Link } from 'react-router-dom';
// import Navbar from '../../layouts/Navbar'; // <--- Updated Path
import PublicNavbar from '../../layouts/PublicNavbar'; // <--- Updated Path
import { Check } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      desc: "Perfect for casual users.",
      features: ["500 Words/day", "Standard Speed", "5 Languages", "Ad-supported"],
      btnText: "Start for Free",
      link: "/signup"
    },
    {
      name: "Pro",
      price: "$29/mo",
      desc: "For professionals & creators.",
      features: ["Unlimited Words", "Instant Speed", "All 100+ Languages", "Priority Support", "No Ads"],
      popular: true,
      btnText: "Get Started",
      link: "/signup"
    },
    {
      name: "Business",
      price: "$99/mo",
      desc: "For teams and agencies.",
      features: ["API Access", "Custom Models", "Dedicated Manager", "SLA Guarantee", "Team Management"],
      btnText: "Contact Sales",
      link: "/contact"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />

      <div className="py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Simple, Transparent <span className="text-blue-600">Pricing</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Choose the plan that fits your needs. No hidden fees.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20 grid md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div key={idx} className={`relative p-8 rounded-2xl bg-white dark:bg-gray-800 border ${plan.popular ? 'border-blue-600 ring-4 ring-blue-600/10' : 'border-gray-200 dark:border-gray-700'} shadow-xl flex flex-col`}>
            {plan.popular && (
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                MOST POPULAR
              </span>
            )}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{plan.desc}</p>
            <div className="my-6">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-center text-gray-600 dark:text-gray-300">
                  <Check className="h-5 w-5 text-green-500 mr-3" /> {feat}
                </li>
              ))}
            </ul>
            <Link 
              to={plan.link}
              className={`w-full py-3 rounded-xl font-bold text-center transition ${
                plan.popular 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {plan.btnText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;