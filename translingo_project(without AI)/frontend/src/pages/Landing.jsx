import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Shield, Zap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Translate the world with <span className="text-blue-600">AI</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Professional grade translation for Punjabi, Urdu, and 50+ other languages. Fast, secure, and accurate.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/signup"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Get started
            </Link>
            <Link to="/home" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              Try Demo <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;