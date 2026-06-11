import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import MetricsGrid from '../components/MetricsGrid';
import AddTaskModal from '../components/AddTaskModal';
import TaskDetailModal from '../components/TaskDetailModal';
import API from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeViewTask, setActiveViewTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'completed'

  const fetchServerTasks = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await API.get('/tasks');
      const fetchedData = res.data.data?.tasks || res.data.tasks || res.data;
      setTasks(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setErrorMsg('Failed to connect to the task server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerTasks();
  }, []);

  const handleToggleStatus = async (task, e) => {
    if (e) e.stopPropagation();
    try {
      const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
      const taskId = task._id || task.id;
      const res = await API.put(`/tasks/${taskId}`, { status: nextStatus });

      if (res.data.success) {
        setTasks(tasks.map(t => ((t._id || t.id) === taskId) ? { ...t, status: nextStatus } : t));
        if (activeViewTask && (activeViewTask._id === taskId || activeViewTask.id === taskId)) {
          setActiveViewTask({ ...activeViewTask, status: nextStatus });
        }
      }
    } catch (err) {
      console.error("Status Update Error:", err);
    }
  };

  const handleDeleteTask = async (taskId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this milestone node?")) return;

    try {
      const res = await API.delete(`/tasks/${taskId}`);
      if (res.data.success) {
        setTasks(tasks.filter(task => (task._id !== taskId && task.id !== taskId)));
      }
    } catch (err) {
      console.error("Purge Error:", err);
      alert("Failed to delete the selected deliverable.");
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <Layout
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onAddTaskClick={() => setIsModalOpen(true)}
    >
      <div className="px-6 md:px-12 py-8 max-w-[1400px] mx-auto selection:bg-primary selection:text-on-primary relative">

        {/* Header bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-outline-variant/20 pb-5 mb-8">


          <div>
            <h3 className="font-headline-sm text-[26px] text-on-surface font-semibold leading-none tracking-tight">Current Sprints</h3>
            <p className="text-[12px] text-on-surface-variant/50 mt-1.5">Manage your high-priority objectives.</p>
          </div>


          <div className="flex-grow flex justify-center lg:justify-center">
            {!loading && !errorMsg && <MetricsGrid tasks={tasks} />}
          </div>


          <div className="flex items-center gap-4 flex-wrap">

            {/* Status Select Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-surface-container border border-outline-variant/40 hover:border-primary/40 text-on-surface rounded-full py-1.5 pl-4 pr-10 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-[11px] font-bold tracking-widest uppercase cursor-pointer transition-colors"
              >
                <option value="all">Status: All</option>
                <option value="pending">Status: Pending</option>
                <option value="completed">Status: Completed</option>
              </select>
              <span className="material-symbols-outlined absolute right-3.5 top-2.5 pointer-events-none text-on-surface-variant/60 !text-[16px]">
                arrow_drop_down
              </span>
            </div>

            {/* Filter Pill Button */}
            <div className="flex items-center gap-1.5 bg-surface-container border border-outline-variant/45 rounded-full px-4 py-1.5 text-on-surface-variant/80 hover:text-on-surface hover:border-primary/45 transition-colors cursor-pointer text-[11px] font-bold tracking-widest uppercase">
              <span className="material-symbols-outlined !text-[15px] font-bold">filter_list</span>
              Filter
            </div>
          </div>
        </div>

        {/* Loading and Error states */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-outline-variant border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-[11px] text-on-surface-variant tracking-widest uppercase font-bold">Querying Database...</p>
          </div>
        ) : errorMsg ? (
          <div className="bg-error-container/10 border border-error/20 p-6 text-error text-center max-w-xl mx-auto rounded-xl">
            <span className="material-symbols-outlined !text-[28px] mb-2">cloud_off</span>
            <p className="font-body-md text-[14px]">{errorMsg}</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="border border-dashed border-outline-variant/40 p-16 text-center max-w-xl mx-auto bg-surface-container/10 rounded-xl">
            <span className="material-symbols-outlined !text-[32px] text-on-surface-variant/40 mb-3">inventory_2</span>
            <h4 className="text-on-surface font-medium text-[16px] mb-1">No Matching Deliverables</h4>
            <p className="text-on-surface-variant text-[13px] mb-6">Change your search query or filter settings.</p>
            {tasks.length === 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 border border-primary text-primary text-[11px] uppercase tracking-widest font-bold hover:bg-primary hover:text-on-primary transition-all duration-300"
              >
                Seed First Deliverable
              </button>
            )}
          </div>
        ) : (
          /* Grid list of tasks */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task._id || task.id}
                onClick={() => { setActiveViewTask(task); setIsDetailOpen(true); }}
                className={`group relative bg-[#1c1c1e] hover:bg-[#242426] border border-outline-variant/15 hover:border-primary/40 rounded-2xl p-6 flex flex-col h-full cursor-pointer transition-all duration-300 shadow-xl ${task.status === 'completed' ? 'opacity-60' : ''
                  }`}
              >
                {/* Card header */}
                <div className="flex justify-between items-center mb-5">
                  <div className="flex gap-2 items-center">
                    {/* Status Pill Badge */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${task.status === 'completed'
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-surface-container-highest/60 text-on-surface-variant/80 border-outline-variant/30'
                      }`}>
                      {task.status}
                    </span>

                    {/* Priority Pill Badge (Styled Dynamically) */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${task.priority === 'high'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : task.priority === 'medium'
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                      {task.priority} Priority
                    </span>
                  </div>

                  {/* More actions menu */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleStatus(task); }}
                    className="text-on-surface-variant/40 hover:text-primary transition-colors p-1"
                    title={task.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
                  >
                    <span className="material-symbols-outlined !text-[18px]">
                      {task.status === 'completed' ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </button>
                </div>

                {/* Title */}
                <h4 className={`font-headline-sm text-[19px] text-on-surface font-semibold mb-2.5 leading-snug tracking-wide group-hover:text-primary transition-colors ${task.status === 'completed' ? 'line-through text-on-surface-variant/40' : ''
                  }`}>
                  {task.title}
                </h4>

                {/* Description Clamp */}
                <p className={`font-body-md text-[13px] text-on-surface-variant/80 leading-relaxed mb-6 flex-grow line-clamp-2 ${task.status === 'completed' ? 'line-through opacity-30' : ''
                  }`}>
                  {task.description}
                </p>

                {/* Card footer */}
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/15 mt-auto">
                  <div className="flex items-center gap-1.5 text-on-surface-variant/60">
                    <span className="material-symbols-outlined !text-[15px]">schedule</span>
                    <span className="text-[12px] font-medium">
                      {task.due && task.due !== 'No Due Date' ? new Date(task.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Due Date'}
                    </span>
                  </div>

                  {/* Circular Hover Arrow Button */}
                  <div className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:text-on-primary text-on-surface-variant/80">
                    <span className="material-symbols-outlined !text-[15px] font-bold">arrow_forward</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchServerTasks}
        />

        {/* Task Detail Modal */}
        <TaskDetailModal
          isOpen={isDetailOpen}
          task={activeViewTask}
          onClose={() => { setIsDetailOpen(false); setActiveViewTask(null); }}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteTask}
          onUpdateSuccess={fetchServerTasks} // Refresh tasks on update
        />

      </div>
    </Layout>
  );
};

export default Dashboard;
