import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ClinicSidebar from '../components/common/ClinicSideBar';

// Focus Trap Hook
function useFocusTrap(active, containerRef, firstFocusableRef) {
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusable = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    // Initial focus
    if (focusable.length) {
      (firstFocusableRef?.current || focusable[0]).focus();
    }

    function handleKeyDown(e) {
      if (e.key !== 'Tab') return;
      const nodes = Array.from(focusable);
      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [active, containerRef, firstFocusableRef]);
}

const ClinicLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Breadcrumb + Title map
  const pathMap = {
    '/clinic/dashboard': { breadcrumb: 'Home / Dashboard', title: 'Dashboard' },
    '/clinic/appointment': { breadcrumb: 'Home / Appointments', title: 'Appointments' },
    '/clinic/doctor': { breadcrumb: 'Home / Doctors', title: 'Doctors' },
    '/clinic/service': { breadcrumb: 'Home / Services', title: 'Services' },
    '/clinic/speciality': { breadcrumb: 'Home / Speciality', title: 'Speciality' },
  };
  const { breadcrumb, title } = pathMap[location.pathname] || { breadcrumb: 'Home', title: '' };

  // Close mobile menu on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Escape key to close sidebar
  const handleEsc = useCallback((e) => {
    if (e.key === 'Escape') setSidebarOpen(false);
  }, []);
  useEffect(() => {
    if (!sidebarOpen) return;
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [sidebarOpen, handleEsc]);

  // Focus trap
  const sidebarContainerRef = useRef(null);
  const firstFocusableRef = useRef(null);
  useFocusTrap(sidebarOpen, sidebarContainerRef, firstFocusableRef);

  // Body scroll lock
  const scrollPosRef = useRef(0);
  useEffect(() => {
    if (sidebarOpen) {
      scrollPosRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
        window.scrollTo(0, scrollPosRef.current);
      };
    }
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-gray-900">
      {/* Global Header */}
      <Header className="z-50" />

      {/* Mobile Navbar Button */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between gap-2 px-4 py-3 bg-[#1B5A90] text-white shadow-md">
        <button
          ref={firstFocusableRef}
          type="button"
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={sidebarOpen}
          aria-controls="clinic-mobile-sidebar"
          onClick={() => setSidebarOpen((v) => !v)}
          className="p-2 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <FaBars size={22} />
        </button>
        <div className="flex-1 truncate text-right text-sm text-gray-200">{breadcrumb}</div>
      </div>

  
      <div className="relative flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          ref={sidebarContainerRef}
          id="clinic-mobile-sidebar"
          className="hidden md:flex md:flex-shrink-0 md:w-72 bg-white border-r border-gray-200 overflow-y-auto md:sticky md:top-0 h-screen"
          aria-label="Clinic navigation"
        >
          <ClinicSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </aside>

        {/* Mobile Sidebar */}
        <div
          className={`md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
          aria-hidden={!sidebarOpen}
        >
          <ClinicSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8 pb-[calc(env(safe-area-inset-bottom,0)+4rem)]">
          <div className="md:hidden h-20" aria-hidden="true" /> {/* Spacer for header + mobile navbar */}
          <div className="mx-auto max-w-full">{children}</div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ClinicLayout;