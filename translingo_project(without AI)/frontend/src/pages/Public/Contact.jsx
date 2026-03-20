import React, { useState } from 'react';
import Navbar from '../../layouts/Navbar';
import { Mail, MapPin, Phone, Send, Loader2 } from 'lucide-react';

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulation of sending email
    setTimeout(() => {
      setLoading(false);
      alert("Message Sent! We will get back to you soon.");
      e.target.reset();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Have questions about our Enterprise plans or need support? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          
          {/* Contact Information (Left Side) */}
          <div className="md:col-span-1 space-y-8">
            
            <div className="bg-blue-50 dark:bg-gray-800 p-8 rounded-2xl">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-blue-600 mt-1 mr-4" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                    <p className="text-gray-600 dark:text-gray-400">support@translingo.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-blue-600 mt-1 mr-4" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Phone</p>
                    <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-blue-600 mt-1 mr-4" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Office</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      123 Innovation Drive,<br />
                      Tech Valley, CA 94043
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Box */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
               <h4 className="font-bold text-gray-900 dark:text-white mb-2">Need faster support?</h4>
               <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Check our Help Center for FAQs and guides.</p>
               <button className="text-blue-600 font-bold hover:underline">Visit Help Center &rarr;</button>
            </div>
          </div>

          {/* Contact Form (Right Side) */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Doe" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>General Inquiry</option>
                  <option>Enterprise Support</option>
                  <option>Billing Question</option>
                  <option>Bug Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea rows="5" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="How can we help you?" required></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Send size={20} className="mr-2" />}
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;