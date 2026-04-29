import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, BrainCircuit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-primary-600 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-500 opacity-90 z-0"></div>
        
        {/* Background Decorative Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary-300/20 rounded-full blur-3xl"></div>

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-white max-w-lg"
        >
          <div className="flex items-center space-x-3 mb-8">
            <BrainCircuit size={48} className="text-primary-100" />
            <h1 className="text-4xl font-display font-bold tracking-tight">AI Placement</h1>
          </div>
          <h2 className="text-5xl font-display font-bold leading-tight mb-6">
            Predict your future.<br/>Shape your career.
          </h2>
          <p className="text-primary-100 text-lg leading-relaxed">
            Join thousands of students using AI to uncover skill gaps, discover tailored recommendations, and land their dream tech roles.
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden">
        {/* Blobs for mobile/right side */}
        <div className="blob-shape bg-primary-200 w-72 h-72 top-[-10%] right-[-10%] lg:hidden"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-panel lg:bg-white lg:dark:bg-dark-card lg:border-none lg:shadow-none lg:backdrop-blur-none rounded-3xl p-8 sm:p-10">
            <div className="text-center lg:text-left mb-10">
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
              <p className="text-gray-500 dark:text-gray-400">Start your journey to better placements today.</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 flex items-center border border-red-100 dark:border-red-800">
                <span className="font-medium">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-dark-border rounded-2xl bg-gray-50/50 dark:bg-dark-bg/50 focus:bg-white dark:focus:bg-dark-card focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all outline-none"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-dark-border rounded-2xl bg-gray-50/50 dark:bg-dark-bg/50 focus:bg-white dark:focus:bg-dark-card focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all outline-none"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-500">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-dark-border rounded-2xl bg-gray-50/50 dark:bg-dark-bg/50 focus:bg-white dark:focus:bg-dark-card focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:text-white transition-all outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-4 px-4 rounded-2xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all shadow-lg hover:shadow-primary-500/25 active:scale-[0.98]"
              >
                <span>Create Account</span>
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="mt-8 text-center lg:text-left text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
