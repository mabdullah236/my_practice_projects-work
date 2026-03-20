import React from 'react';
// import Navbar from '../../layouts/Navbar';
import PublicNavbar from '../../layouts/PublicNavbar';
import { Zap, Shield, Globe, Cpu, MessageSquare, Smartphone } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      title: "100+ Languages",
      desc: "Translate text seamlessly between over 100 languages with native-level accuracy."
    },
    {
      icon: <Cpu className="h-8 w-8 text-purple-600" />,
      title: "AI-Powered Engine",
      desc: "Our advanced neural networks understand context, idioms, and cultural nuances."
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Enterprise Security",
      desc: "Bank-grade encryption ensures your sensitive data remains private and secure."
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Real-time Processing",
      desc: "Experience zero latency. Get instant translations as you type or speak."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-pink-600" />,
      title: "Context Awareness",
      desc: "The AI detects tone and intent, ensuring formal or casual translations are spot on."
    },
    {
      icon: <Smartphone className="h-8 w-8 text-indigo-600" />,
      title: "Cross-Platform",
      desc: "Access your dashboard from Web, Mobile, or Desktop with synchronized history."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* <Navbar /> */}
      <PublicNavbar/>
      
      {/* Hero Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Powerful Features for <span className="text-blue-600">Global Communication</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to break language barriers and expand your business worldwide.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition hover:-translate-y-1">
              <div className="mb-4 bg-gray-50 dark:bg-gray-700 w-16 h-16 rounded-xl flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;