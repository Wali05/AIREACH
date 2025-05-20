'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CreditCard, Bell, Mail, UserCog, CheckCircle, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [stripeConnected, setStripeConnected] = useState(false); // Demo state

  const toggleStripeConnection = () => {
    setStripeConnected(!stripeConnected);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-cyan-500 dark:from-violet-400 dark:to-cyan-300 mb-6"
      >
        Settings
      </motion.h1>

      {/* Settings Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'account', label: 'Account', icon: UserCog },
          { id: 'billing', label: 'Billing', icon: CreditCard },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'email', label: 'Email', icon: Mail }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700'
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-gray-100 dark:border-gray-700">
        {activeTab === 'billing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Payment Methods</h2>
            
            {/* Stripe Connection Status */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Stripe Account</h3>
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
                    <CreditCard className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {stripeConnected ? 'Stripe Connected' : 'Connect Stripe'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stripeConnected 
                        ? 'Your account is connected to Stripe for payments' 
                        : 'Connect your Stripe account to accept payments'}
                    </p>
                  </div>
                </div>
                <motion.button 
                  onClick={toggleStripeConnection}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                    stripeConnected 
                      ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400'
                  }`}
                >
                  {stripeConnected ? (
                    <>
                      <CheckCircle size={18} />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink size={18} />
                      <span>Connect</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
            
            {/* Subscription Plans */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Subscription Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Basic', price: '$9.99', features: ['10 webinars/month', 'Basic analytics', 'Email support'] },
                  { name: 'Pro', price: '$29.99', features: ['Unlimited webinars', 'Advanced analytics', 'Priority support', 'Custom branding'], current: true },
                  { name: 'Enterprise', price: '$99.99', features: ['Everything in Pro', 'Dedicated manager', 'API access', '99.99% uptime SLA'] }
                ].map((plan) => (
                  <motion.div 
                    key={plan.name}
                    whileHover={{ y: -5 }}
                    className={`relative p-5 rounded-lg border ${
                      plan.current 
                        ? 'border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {plan.current && (
                      <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-violet-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h4>
                    <p className="text-2xl font-bold my-2 text-gray-900 dark:text-white">{plan.price}<span className="text-sm font-normal text-gray-500 dark:text-gray-400"> /month</span></p>
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {!plan.current && (
                      <button className="mt-6 w-full py-2 rounded-md text-center font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        Switch Plan
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab !== 'billing' && (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Other settings coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
} 