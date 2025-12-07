import { useState, useEffect, useRef } from 'react';
import { useLocation, Outlet } from 'react-router';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import { Chatbot } from './chatbot';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef(null);
  const location = useLocation();

  // Check if current page is AI Summarizer
  const isAiSummarizerPage = location.pathname === '/dashboard/ai-assistant';

  // Scroll to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main ref={mainRef} className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Chatbot Widget - Hidden on AI Summarizer page */}
      {!isAiSummarizerPage && <Chatbot />}
    </div>
  );
};

export default DashboardLayout;

