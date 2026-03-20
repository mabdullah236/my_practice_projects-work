import React from 'react';
import { Cpu, Globe, CheckCircle, Zap } from 'lucide-react';

const OurModels = () => {
  const models = [
    { name: 'Indo-Aryan V1', languages: 'Punjabi ↔ Urdu', status: 'Active', accuracy: '98%' },
    { name: 'Global Connect', languages: 'English ↔ Spanish', status: 'Active', accuracy: '99%' },
    { name: 'Euro Mix', languages: 'French ↔ German', status: 'Beta', accuracy: '94%' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
          AI Translation Models
        </h1>
        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Explore our state-of-the-art neural networks fine-tuned for specific language families.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {models.map((model, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-8">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-6">
                <Cpu className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{model.name}</h3>
              <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
                <Globe size={16} className="mr-2" />
                {model.languages}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    model.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {model.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Accuracy</span>
                  <span className="font-bold text-gray-900 dark:text-white">{model.accuracy}</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <span className="text-xs text-gray-500">Last updated: 2 days ago</span>
              <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center">
                Test Model <Zap size={14} className="ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurModels;