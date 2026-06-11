import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import API from '../services/api';

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await API.get('/tasks');
        const fetchedData = res.data.data?.tasks || res.data.tasks || res.data;
        setTasks(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setErrorMsg("Failed to load analytics engine.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Calculate metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highPriority = tasks.filter(t => t.priority === 'high');
  const mediumPriority = tasks.filter(t => t.priority === 'medium');
  const lowPriority = tasks.filter(t => t.priority === 'low');

  const highCompleted = highPriority.filter(t => t.status === 'completed').length;
  const mediumCompleted = mediumPriority.filter(t => t.status === 'completed').length;
  const lowCompleted = lowPriority.filter(t => t.status === 'completed').length;

  const highCompletionRate = highPriority.length > 0 ? Math.round((highCompleted / highPriority.length) * 100) : 0;
  const mediumCompletionRate = mediumPriority.length > 0 ? Math.round((mediumCompleted / mediumPriority.length) * 100) : 0;
  const lowCompletionRate = lowPriority.length > 0 ? Math.round((lowCompleted / lowPriority.length) * 100) : 0;

  // Circular progress calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <Layout>
      <div className="px-6 md:px-12 py-8 max-w-[1400px] mx-auto selection:bg-primary selection:text-on-primary">

        <div className="border-b border-outline-variant/20 pb-5 mb-8">
          <h3 className="font-headline-sm text-[26px] text-on-surface font-semibold leading-none tracking-tight">Performance Matrix</h3>
          <p className="text-[12px] text-on-surface-variant/50 mt-1.5 font-sans">Statistical computation of user milestones and execution efficiency.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-outline-variant border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-[11px] text-on-surface-variant tracking-widest uppercase font-bold">Parsing metrics...</p>
          </div>
        ) : errorMsg ? (
          <div className="bg-error-container/10 border border-error/20 p-6 text-error text-center max-w-xl mx-auto rounded-xl">
            <span className="material-symbols-outlined !text-[28px] mb-2">cloud_off</span>
            <p className="font-body-md text-[14px]">{errorMsg}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            

            <div className="bg-[#1c1c1e] border border-outline-variant/15 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl">
              <h4 className="text-[12px] text-on-surface-variant/50 uppercase tracking-widest font-bold mb-6">Execution Efficiency</h4>
              
              <div className="relative flex items-center justify-center w-36 h-36">
                <svg className="w-full h-full transform -rotate-90">

                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    className="stroke-outline-variant/10 fill-none"
                    strokeWidth="8"
                  />

                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    className="stroke-primary fill-none transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0px 0px 4px rgba(212, 175, 55, 0.4))' }}
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-[28px] font-bold text-on-surface leading-none tracking-tight">{completionRate}%</span>
                  <span className="text-[9px] uppercase tracking-wider text-on-surface-variant/50 mt-1 font-semibold">completed</span>
                </div>
              </div>

              <div className="grid grid-cols-2 w-full gap-4 border-t border-outline-variant/15 pt-6 mt-6">
                <div className="text-center">
                  <p className="text-[18px] font-semibold text-primary">{completedTasks}</p>
                  <p className="text-[10px] text-on-surface-variant/60 uppercase font-bold tracking-wider">verified</p>
                </div>
                <div className="text-center border-l border-outline-variant/15">
                  <p className="text-[18px] font-semibold text-on-surface">{pendingTasks}</p>
                  <p className="text-[10px] text-on-surface-variant/60 uppercase font-bold tracking-wider">active</p>
                </div>
              </div>
            </div>


            <div className="lg:col-span-2 bg-[#1c1c1e] border border-outline-variant/15 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
              <div>
                <h4 className="text-[12px] text-on-surface-variant/50 uppercase tracking-widest font-bold mb-6">Priority Distribution & Completion</h4>
                <div className="space-y-6">

                  <div>
                    <div className="flex justify-between items-center text-[12px] mb-2">
                      <span className="font-semibold text-red-400 uppercase tracking-wider text-[10px]">High Priority ({highPriority.length})</span>
                      <span className="text-on-surface-variant/80 font-bold">{highCompletionRate}% Complete</span>
                    </div>
                    <div className="h-2.5 w-full bg-outline-variant/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 transition-all duration-1000 ease-out" 
                        style={{ width: `${highCompletionRate}%` }}
                      ></div>
                    </div>
                  </div>


                  <div>
                    <div className="flex justify-between items-center text-[12px] mb-2">
                      <span className="font-semibold text-primary uppercase tracking-wider text-[10px]">Medium Priority ({mediumPriority.length})</span>
                      <span className="text-on-surface-variant/80 font-bold">{mediumCompletionRate}% Complete</span>
                    </div>
                    <div className="h-2.5 w-full bg-outline-variant/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000 ease-out" 
                        style={{ width: `${mediumCompletionRate}%` }}
                      ></div>
                    </div>
                  </div>


                  <div>
                    <div className="flex justify-between items-center text-[12px] mb-2">
                      <span className="font-semibold text-blue-400 uppercase tracking-wider text-[10px]">Low Priority ({lowPriority.length})</span>
                      <span className="text-on-surface-variant/80 font-bold">{lowCompletionRate}% Complete</span>
                    </div>
                    <div className="h-2.5 w-full bg-outline-variant/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-1000 ease-out" 
                        style={{ width: `${lowCompletionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-outline-variant/15 flex items-center justify-between text-[11px] text-on-surface-variant/60">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                  Workspace Average Standard
                </span>
                <span className="font-bold text-on-surface">{totalTasks} Total Nodes In Sync</span>
              </div>
            </div>


            <div className="lg:col-span-3 bg-[#1c1c1e] border border-outline-variant/15 rounded-2xl p-6 shadow-xl">
              <h4 className="text-[12px] text-on-surface-variant/50 uppercase tracking-widest font-bold mb-5">Workspace Efficiency Insights</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container/20 border border-outline-variant/10 p-4 rounded-xl">
                  <div className="flex items-center gap-3 text-primary mb-2">
                    <span className="material-symbols-outlined !text-[20px]">insights</span>
                    <h5 className="text-[12px] font-bold uppercase tracking-wider">Velocity Index</h5>
                  </div>
                  <p className="text-[11px] text-on-surface-variant/70 leading-relaxed">
                    {completionRate > 70 
                      ? "High operational pace detected. Tasks are being checked off dynamically with minimal bottleneck overhead." 
                      : completionRate > 40
                      ? "Steady progression. Recommended to review pending milestones to optimize node delivery speeds."
                      : "Action required. A critical accumulation of pending database nodes is causing workspace stagnation."}
                  </p>
                </div>

                <div className="bg-surface-container/20 border border-outline-variant/10 p-4 rounded-xl">
                  <div className="flex items-center gap-3 text-red-400 mb-2">
                    <span className="material-symbols-outlined !text-[20px]">warning</span>
                    <h5 className="text-[12px] font-bold uppercase tracking-wider">Critical Bottlenecks</h5>
                  </div>
                  <p className="text-[11px] text-on-surface-variant/70 leading-relaxed">
                    You have <span className="text-red-400 font-bold">{highPriority.filter(t => t.status !== 'completed').length} pending high-priority</span> deliverables remaining. Resolving these blocks will stabilize system output metrics immediately.
                  </p>
                </div>

                <div className="bg-surface-container/20 border border-outline-variant/10 p-4 rounded-xl">
                  <div className="flex items-center gap-3 text-blue-400 mb-2">
                    <span className="material-symbols-outlined !text-[20px]">verified</span>
                    <h5 className="text-[12px] font-bold uppercase tracking-wider">Accomplishments</h5>
                  </div>
                  <p className="text-[11px] text-on-surface-variant/70 leading-relaxed">
                    A total of <span className="text-blue-400 font-bold">{completedTasks} milestones</span> have been safely cataloged as resolved. Excellent tracking integrity and workspace state retention.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;
