import React from 'react';
import { Helmet } from 'react-helmet-async';
import TranslationBox from '../components/features/TranslationBox';
import { Zap, Shield, Globe } from 'lucide-react';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Home - TransLingo AI Translation</title>
        <meta name="description" content="Translate text instantly between 100+ languages using our advanced AI models." />
      </Helmet>

      {/* Hero Section with Translation Box */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Break Language Barriers with <span className="text-blue-600">AI</span>
            </h1>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Instantly translate text, documents, and websites with neural machine learning accuracy.
            </p>
          </div>

          {/* Core Feature Component */}
          <div className="max-w-4xl mx-auto">
            <TranslationBox />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="p-6">
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <Zap className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-500 dark:text-gray-400">Real-time translations powered by optimized edge computing servers.</p>
            </div>

            <div className="p-6">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <Shield className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Secure & Private</h3>
              <p className="text-gray-500 dark:text-gray-400">Your data is encrypted end-to-end. We never store your sensitive documents.</p>
            </div>

            <div className="p-6">
              <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <Globe className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">100+ Languages</h3>
              <p className="text-gray-500 dark:text-gray-400">From Spanish to Swahili, our models cover the vast majority of global communication.</p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Home;