import { Twitter, Instagram, Linkedin, Brain } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#overview" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Overview</a></li>
              <li><a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Features</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Comparison</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Tech Specs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Setup Guide</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Downloads</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">About</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">News</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Press</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Media Kit</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Newsletter</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Terms</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Privacy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Security</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-semibold text-gray-900">MindTrace</span>

          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} MindTrace. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
