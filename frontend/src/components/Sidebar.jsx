import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { label: 'My Tasks', icon: 'assignment', path: '/tasks' },
    { label: 'Analytics', icon: 'monitoring', path: '/analytics' },
    { label: 'Workspace Configuration', icon: 'settings', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-surface-container-low border-r border-outline-variant/30 flex flex-col py-8 flex-shrink-0 z-50 transition-transform duration-300 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        
        {/* Close button for mobile */}
        <button 
          onClick={toggleSidebar}
          className="absolute top-6 right-6 text-on-surface-variant/60 hover:text-on-surface md:hidden transition-colors"
        >
          <span className="material-symbols-outlined !text-[20px]">close</span>
        </button>

        {/* Brand Logo */}
        <div className="px-8 mb-10">
          <h1 className="font-display-lg text-[32px] text-on-surface tracking-tight font-semibold leading-none">TaskSync.</h1>
          <p className="text-primary font-label-sm text-[10px] tracking-widest mt-1.5 font-bold uppercase">PREMIUM MANAGEMENT</p>
        </div>

        {/* Navigation links */}
        <nav className="flex-grow">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li 
                  key={link.label}
                  className={`text-on-surface pl-5 transition-all hover:bg-surface-container/20 
                    ${isActive ? 'border-l-2 border-primary bg-surface-container/30 pl-[18px]' : 'text-on-surface-variant/70'}`}
                >
                  <Link 
                    to={link.path}
                    onClick={() => { if (isOpen) toggleSidebar(); }}
                    className={`flex items-center gap-4 py-3 text-inherit transition-colors duration-200 ${isActive ? 'text-primary' : ''}`}
                  >
                    <span className="material-symbols-outlined !text-[18px]">{link.icon}</span>
                    <span className="font-label-md text-[13px] uppercase tracking-wider font-semibold">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Profile and Logout section */}
        {user && (
          <div className="px-6 pt-6 border-t border-outline-variant/20 mt-auto flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-surface-container/50 p-3 border border-outline-variant/20 rounded-none">
              <div className="w-9 h-9 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-[13px] font-semibold text-on-surface truncate leading-tight">{user.name}</p>
                <p className="text-[10px] text-on-surface-variant/60 truncate leading-none mt-1">{user.email}</p>
              </div>
            </div>

            <button 
              onClick={logout}
              className="w-full py-2.5 border border-outline-variant/60 hover:border-error hover:text-error text-on-surface-variant text-[11px] uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined !text-[14px]">logout</span>
              Disconnect Profile
            </button>
          </div>
        )}

      </aside>
    </>
  );
};

export default Sidebar;
