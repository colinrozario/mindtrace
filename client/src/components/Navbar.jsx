import React from 'react';
import { Link } from 'react-router';
import { Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-semibold text-2xl text-gray-900 tracking-tight">MindTrace</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#overview" 
              className="text-gray-700 hover:text-gray-900 transition-colors text-md font-medium"
            >
              Overview
            </a>
            <a 
              href="#features" 
              className="text-gray-700 hover:text-gray-900 transition-colors text-md font-medium"
            >
              Features
            </a>
            <a 
              href="#support" 
              className="text-gray-700 hover:text-gray-900 transition-colors text-md font-medium"
            >
              Support
            </a>
            <button className="bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all font-medium text-md">
              Join Now
            </button>
          </div>

          {/* Mobile menu button - Clean and minimal */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-95"
              aria-label="Toggle menu"
            >
              <div className={`transition-all duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
                {isOpen ? (
                  <X className="h-6 w-6 text-gray-900" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-900" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-0 top-20 bg-white z-50 transition-all duration-500 ease-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-white to-indigo-50/30" />
        
        {/* Content Container */}
        <div className="relative h-full flex flex-col px-8 py-12">
          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col justify-center space-y-2">
            <a 
              href="#overview"
              className={`group relative py-6 text-gray-900 transition-all duration-300 ${
                isOpen ? 'animate-slideInUp' : ''
              }`}
              style={{ animationDelay: '50ms' }}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                  Overview
                </span>
                <ArrowRight className="h-6 w-6 text-indigo-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <div className="h-px bg-linear-to-r from-gray-200 to-transparent mt-6" />
            </a>
            
            <a 
              href="#features"
              className={`group relative py-6 text-gray-900 transition-all duration-300 ${
                isOpen ? 'animate-slideInUp' : ''
              }`}
              style={{ animationDelay: '100ms' }}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                  Features
                </span>
                <ArrowRight className="h-6 w-6 text-indigo-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <div className="h-px bg-linear-to-r from-gray-200 to-transparent mt-6" />
            </a>
            
            <a 
              href="#support"
              className={`group relative py-6 text-gray-900 transition-all duration-300 ${
                isOpen ? 'animate-slideInUp' : ''
              }`}
              style={{ animationDelay: '150ms' }}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                  Support
                </span>
                <ArrowRight className="h-6 w-6 text-indigo-500 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <div className="h-px bg-linear-to-r from-gray-200 to-transparent mt-6" />
            </a>
          </nav>
          
          {/* Bottom CTA */}
          <div 
            className={`space-y-4 ${
              isOpen ? 'animate-slideInUp' : ''
            }`}
            style={{ animationDelay: '200ms' }}
          >
            <button 
              className="w-full bg-gray-900 text-white px-8 py-5 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-gray-800 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              onClick={() => setIsOpen(false)}
            >
              Join the Waitlist
            </button>
            
            {/* Decorative indicator */}
            <div className="flex justify-center gap-2 pt-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <div className="w-2 h-2 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
