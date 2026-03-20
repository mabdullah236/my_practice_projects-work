import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin } from 'lucide-react';

// Validation Schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const ContactUs = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    // await contactService.sendMessage(data);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - TransLingo</title>
        <meta name="description" content="Get in touch with our support team." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Get in Touch</h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
                We'd love to hear from you. Our friendly team is always here to chat.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Mail className="h-6 w-6 text-blue-600" />
                <span>support@translingo.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <Phone className="h-6 w-6 text-blue-600" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <MapPin className="h-6 w-6 text-blue-600" />
                <span>123 Innovation Dr, Tech City</span>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="h-64 w-full rounded-lg overflow-hidden shadow-lg">
              <iframe
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1!2d-73.98!3d40.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMCcxNS42Ik4gNzPCsDU5JzE1LjYiVw!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  {...register("name")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  {...register("email")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                <textarea
                  rows={4}
                  {...register("message")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;