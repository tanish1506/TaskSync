import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const Layout = ({ children, searchQuery = '', setSearchQuery = () => {}, onAddTaskClick = () => {} }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen w-screen bg-background text-on-surface flex overflow-hidden font-body-md relative">
      

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />


      <div className="flex-grow h-full flex flex-col overflow-hidden">
        

        <header className="bg-background/40 backdrop-blur-md flex justify-between items-center px-4 md:px-12 h-20 border-b border-outline-variant/30 flex-shrink-0 z-20 gap-4 relative">
          
          {isSearchExpanded ? (
            /* Mobile search overlay */
            <div className="absolute inset-0 bg-background px-6 flex items-center justify-between z-30 animate-fade-in gap-4">
              <div className="flex items-center gap-3 w-full">
                <span className="material-symbols-outlined text-primary !text-[20px]">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search deliverables..."
                  autoFocus
                  className="bg-transparent text-on-surface outline-none w-full font-body-md text-[13px] border-b border-outline-variant/30 pb-1"
                />
                <button 
                  onClick={() => { setIsSearchExpanded(false); setSearchQuery(''); }} 
                  className="text-on-surface-variant/60 hover:text-on-surface p-1 shrink-0"
                >
                  <span className="material-symbols-outlined !text-[20px]">close</span>
                </button>
              </div>
            </div>
          ) : (
            /* Normal header layout */
            <>
              <div className="flex items-center gap-3 min-w-0">

                <button 
                  onClick={toggleSidebar}
                  className="text-on-surface hover:text-primary md:hidden transition-colors flex-shrink-0"
                  title="Toggle Menu"
                >
                  <span className="material-symbols-outlined !text-[24px]">menu</span>
                </button>
                

                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-[10px] text-on-surface-variant/50 uppercase font-bold tracking-widest">Welcome,</span>
                  <span className="text-[13px] sm:text-[15px] text-primary font-bold truncate max-w-[100px] xs:max-w-[140px] sm:max-w-none">
                    {user?.name || 'Operator'}
                  </span>
                </div>
              </div>


              <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                

                <button 
                  onClick={() => setIsSearchExpanded(true)} 
                  className="flex md:hidden w-8 h-8 rounded-full border border-outline-variant/30 items-center justify-center text-on-surface-variant/70 hover:text-primary transition-all shrink-0"
                  title="Search Workspace"
                >
                  <span className="material-symbols-outlined !text-[18px]">search</span>
                </button>
                

                <div className="hidden md:flex items-center relative">
                  <span className="material-symbols-outlined absolute left-3 text-on-surface-variant/40 !text-[14px]">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search logs..."
                    className="bg-surface-container-low border border-outline-variant/40 text-on-surface rounded-full py-1.5 pl-8 pr-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all w-48 lg:w-60 font-body-md text-[11px] placeholder:text-on-surface-variant/30"
                  />
                </div>
                

                <button className="text-on-surface-variant/70 hover:text-primary transition-colors relative flex-shrink-0">
                  <span className="material-symbols-outlined !text-[18px]">notifications</span>
                  <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary rounded-full"></span>
                </button>


                <button 
                  onClick={onAddTaskClick}
                  className="flex items-center justify-center w-8 h-8 sm:w-auto sm:px-4 sm:py-1.5 bg-primary text-on-primary text-[10px] uppercase tracking-widest font-bold hover:opacity-90 active:scale-[0.98] transition-all duration-300 rounded-full shadow-md shadow-primary/10 border border-primary flex-shrink-0"
                  title="Add Task"
                >
                  <span className="material-symbols-outlined !text-[13px] font-bold">add</span>
                  <span className="hidden sm:inline ml-1.5">Add Task</span>
                </button>
              </div>
            </>
          )}

        </header>

        {/* Main layout content */}
        <main className="flex-grow overflow-x-hidden overflow-y-auto bg-surface-container-lowest/20 relative">
          {children}
        </main>
      </div>

    </div>
  );
};

export default Layout;
