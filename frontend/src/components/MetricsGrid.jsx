import React from 'react';

const MetricsGrid = ({ tasks = [] }) => {
  const totalAllocations = tasks.length;
  const pendingBacklog = tasks.filter(task => task.status === 'pending').length;
  const closedMilestones = tasks.filter(task => task.status === 'completed').length;

  const stats = [
    { label: 'Allocations', value: totalAllocations, color: 'text-primary' },
    { label: 'Pending', value: pendingBacklog, color: 'text-on-surface-variant' },
    { label: 'Completed', value: closedMilestones, color: 'text-green-400' }
  ];

  return (
    <div className="flex items-center gap-3.5 flex-wrap">
      {stats.map((stat) => (
        <div 
          key={stat.label} 
          className="flex items-center gap-2 bg-surface-container-low/60 border border-outline-variant/20 px-3 py-1 text-[11px]"
        >
          <span className="text-on-surface-variant/40 font-bold uppercase tracking-wider text-[9px]">{stat.label}</span>
          <span className={`${stat.color} font-bold`}>{stat.value}</span>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;
