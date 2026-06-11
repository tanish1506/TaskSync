import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');
  
  // Local storage properties
  const [defaultPriority, setDefaultPriority] = useState(
    () => localStorage.getItem('pref_default_priority') || 'medium'
  );
  const [sortingPreference, setSortingPreference] = useState(
    () => localStorage.getItem('pref_sort_order') || 'due'
  );
  const [showCompleted, setShowCompleted] = useState(
    () => localStorage.getItem('pref_show_completed') !== 'false'
  );
  const [glassEffect, setGlassEffect] = useState(
    () => localStorage.getItem('pref_glass_effect') !== 'false'
  );

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('pref_default_priority', defaultPriority);
    localStorage.setItem('pref_sort_order', sortingPreference);
    localStorage.setItem('pref_show_completed', showCompleted.toString());
    localStorage.setItem('pref_glass_effect', glassEffect.toString());
    
    setSuccessMsg('System preferences synchronized successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <Layout>
      <div className="px-6 md:px-12 py-8 max-w-[1400px] mx-auto selection:bg-primary selection:text-on-primary">
        

        <div className="border-b border-outline-variant/20 pb-5 mb-8">
          <h3 className="font-headline-sm text-[26px] text-on-surface font-semibold leading-none tracking-tight">Workspace Configuration</h3>
          <p className="text-[12px] text-on-surface-variant/50 mt-1.5 font-sans">Maintain custom terminal preferences and secure credentials.</p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-[12px] tracking-wider uppercase font-bold flex items-center gap-2 rounded-xl animate-fade-in">
            <span className="material-symbols-outlined !text-[16px]">verified</span>
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          

          <div className="bg-[#1c1c1e] border border-outline-variant/15 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center">
            <h4 className="text-[12px] text-on-surface-variant/50 uppercase tracking-widest font-bold mb-6 w-full text-left">Identity Node</h4>
            
            <div className="w-20 h-20 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-2xl mb-4 rounded-xl shadow-inner">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            
            <h5 className="text-[16px] text-on-surface font-semibold">{user?.name || 'Authorized Member'}</h5>
            <p className="text-[11px] text-on-surface-variant/60 uppercase tracking-wider font-bold mt-1">Systems Operator</p>
            
            <div className="w-full border-t border-outline-variant/10 pt-5 mt-6 space-y-4 text-left">
              <div>
                <label className="text-[9px] uppercase tracking-wider text-on-surface-variant/40 font-bold block mb-1">Email Coordinates</label>
                <p className="text-[13px] text-on-surface-variant/90 break-all">{user?.email || 'N/A'}</p>
              </div>
              
              <div>
                <label className="text-[9px] uppercase tracking-wider text-on-surface-variant/40 font-bold block mb-1">Encryption Protocol</label>
                <span className="px-2 py-0.5 rounded bg-surface-container text-primary text-[9px] font-bold tracking-wider uppercase border border-outline-variant/20">
                  JWT HMAC-SHA256
                </span>
              </div>
            </div>
          </div>


          <div className="lg:col-span-2 bg-[#1c1c1e] border border-outline-variant/15 rounded-2xl p-6 shadow-xl">
            <h4 className="text-[12px] text-on-surface-variant/50 uppercase tracking-widest font-bold mb-6">User Interface Preferences</h4>
            
            <form onSubmit={handleSave} className="space-y-6">
              

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-on-surface-variant/70 font-bold block mb-2">Default Task Priority</label>
                  <select
                    value={defaultPriority}
                    onChange={(e) => setDefaultPriority(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/40 hover:border-primary/40 text-on-surface rounded-xl p-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-[12px] transition-colors"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>


                <div>
                  <label className="text-[10px] uppercase tracking-wider text-on-surface-variant/70 font-bold block mb-2">Primary Sorting Mode</label>
                  <select
                    value={sortingPreference}
                    onChange={(e) => setSortingPreference(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/40 hover:border-primary/40 text-on-surface rounded-xl p-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-[12px] transition-colors"
                  >
                    <option value="due">Timeline Anchor (Due Date)</option>
                    <option value="priority">Classification Weight (Priority)</option>
                    <option value="title">Alphabetical (A - Z)</option>
                  </select>
                </div>
              </div>


              <div className="border-t border-outline-variant/10 pt-6 space-y-4">
                

                <div className="flex items-center justify-between gap-4 p-3.5 bg-surface-container/20 border border-outline-variant/10 rounded-xl hover:bg-surface-container/30 transition-all">
                  <div className="pr-4 min-w-0">
                    <h6 className="text-[13px] font-semibold text-on-surface leading-snug">Persist Completed Milestones</h6>
                    <p className="text-[11px] text-on-surface-variant/50 mt-0.5 leading-normal">Show completed deliverables in the current bento dashboard.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCompleted(!showCompleted)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none flex items-center flex-shrink-0 ${
                      showCompleted ? 'bg-primary' : 'bg-surface-container-highest border border-outline-variant/40'
                    }`}
                  >
                    <span 
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                        showCompleted ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>


                <div className="flex items-center justify-between gap-4 p-3.5 bg-surface-container/20 border border-outline-variant/10 rounded-xl hover:bg-surface-container/30 transition-all">
                  <div className="pr-4 min-w-0">
                    <h6 className="text-[13px] font-semibold text-on-surface leading-snug">Glassmorphism Overlay Node</h6>
                    <p className="text-[11px] text-on-surface-variant/50 mt-0.5 leading-normal">Inject dynamic blurred backdrop filters across modal layouts.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGlassEffect(!glassEffect)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none flex items-center flex-shrink-0 ${
                      glassEffect ? 'bg-primary' : 'bg-surface-container-highest border border-outline-variant/40'
                    }`}
                  >
                    <span 
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                        glassEffect ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

              </div>


              <div className="border-t border-outline-variant/10 pt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-on-primary text-[11px] uppercase tracking-widest font-bold hover:bg-primary/95 transition-all duration-300 rounded-lg shadow-lg hover:shadow-primary/10"
                >
                  Save Workspace Prefs
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default Settings;