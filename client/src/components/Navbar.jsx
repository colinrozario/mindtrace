import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const menuItemsRef = useRef([]);
  const menuOverlayRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle menu animation
  useEffect(() => {
    const menu = menuRef.current;
    const overlay = menuOverlayRef.current;
    const items = menuItemsRef.current;

    if (isMenuOpen) {
      // Open animation
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        pointerEvents: 'auto',
        ease: 'power2.out'
      });
      
      gsap.to(menu, {
        x: 0,
        duration: 0.5,
        ease: 'power3.out'
      });

      gsap.fromTo(items, 
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          delay: 0.2,
          ease: 'power2.out'
        }
      );
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Close animation
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        pointerEvents: 'none',
        ease: 'power2.in'
      });

      gsap.to(menu, {
        x: '100%',
        duration: 0.5,
        ease: 'power3.inOut'
      });
      
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Overview', href: '#overview' },
    { name: 'Features', href: '#features' },
    { name: 'Specs', href: '#support' },
  ];

  const addToRefs = (el, index) => {
    if (el) {
      menuItemsRef.current[index] = el;
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-6 ${
          scrolled || isMenuOpen 
            ? 'bg-white/50 backdrop-blur-md' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group z-50 relative">
              <span className={`font-bold text-xl tracking-tight transition-colors duration-300 ${
                isMenuOpen ? 'text-gray-900' : 'text-gray-900'
              }`}>
                MindTrace
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <a 
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <button className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:shadow-lg hover:scale-105 active:scale-95">
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden relative z-50 p-2 -mr-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        ref={menuOverlayRef}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 opacity-0 pointer-events-none md:hidden"
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Sidebar */}
      <div 
        ref={menuRef}
        className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-40 shadow-2xl transform translate-x-full md:hidden flex flex-col"
      >
        <div className="flex-1 px-8 pt-28 pb-8 flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            {navLinks.map((link, index) => (
              <a 
                key={link.name}
                href={link.href}
                ref={(el) => addToRefs(el, index)}
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-semibold text-gray-900 flex items-center justify-between group"
              >
                {link.name}
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </a>
            ))}
          </div>

          <div ref={(el) => addToRefs(el, navLinks.length)} className="mt-auto">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-2">Ready to start?</h4>
              <p className="text-sm text-gray-500 mb-4">Join the waitlist and be the first to experience the future.</p>
              <button className="w-full bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
