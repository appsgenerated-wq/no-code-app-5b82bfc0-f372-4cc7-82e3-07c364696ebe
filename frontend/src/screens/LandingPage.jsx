import React, { useState } from 'react';
import { BuildingStorefrontIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import config from '../constants.js';

const LandingPage = ({ onLogin, onSignup }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isLoginView) {
      onLogin(email, password);
    } else {
      onSignup(name, email, password);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <div className="lg:w-1/2 w-full flex flex-col justify-center items-start p-8 sm:p-12 lg:p-20">
        <div className="flex items-center text-blue-600 mb-4">
          <BuildingStorefrontIcon className="w-10 h-10 mr-3" />
          <span className="text-2xl font-bold">FlavorFind</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
          Manage Your Restaurant, Delight Your Customers.
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The all-in-one platform to bring your restaurant online. Create your menu, manage your presence, and connect with diners instantly.
        </p>
        <div className="flex items-center">
          <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors">
            Explore Admin Panel
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
      <div className="lg:w-1/2 w-full bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">{isLoginView ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-center text-gray-500 mb-6">
            {isLoginView ? 'Sign in to manage your restaurant.' : 'Get started in seconds.'}
          </p>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {!isLoginView && (
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              {isLoginView ? 'Login' : 'Sign Up'}
            </button>
             <button type="button" onClick={() => onLogin('owner@demo.com', 'password')} className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors mt-2">
              Try Demo
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-blue-600 hover:underline ml-1">
              {isLoginView ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
