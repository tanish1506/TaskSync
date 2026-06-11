import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import AddTaskModal from '../components/AddTaskModal';
import TaskDetailModal from '../components/TaskDetailModal';
import API from '../services/api';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeViewTask, setActiveViewTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
      <div className="px-6 md:px-12 py-8 max-w-[1400px] mx-auto selection:bg-primary selection:text-on-primary">
        
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-outline-variant/20 pb-5 mb-8">
          <div>
            <h3 className="font-headline-sm text-[26px] text-on-surface font-semibold leading-none tracking-tight">System Logs</h3>
            <p className="text-[12px] text-on-surface-variant/50 mt-1.5">Full tabular list of database deliverables.</p>
          </div>

          <div className="flex bg-surface-container border border-outline-variant/40 p-0.5 rounded-full">
            {['all', 'pending', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${
                  statusFilter === tab 
                    ? 'bg-primary text-on-primary' 
                    : 'text-on-surface-variant/80 hover:text-on-surface'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table container */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-outline-variant border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-[11px] text-on-surface-variant tracking-widest uppercase font-bold">Querying Data Matrix...</p>
          </div>
        ) : errorMsg ? (
          <div className="bg-error-container/10 border border-error/20 p-6 text-error text-center max-w-xl mx-auto rounded-xl">
            <span className="material-symbols-outlined !text-[28px] mb-2">cloud_off</span>
            <p className="font-body-md text-[14px]">{errorMsg}</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="border border-dashed border-outline-variant/40 p-16 text-center max-w-xl mx-auto bg-surface-container/10 rounded-xl">
            <span className="material-symbols-outlined !text-[32px] text-on-surface-variant/40 mb-3">inventory_2</span>
            <h4 className="text-on-surface font-medium text-[16px] mb-1">No Matching Records</h4>
            <p className="text-on-surface-variant text-[13px] mb-6">Modify filters or search queries.</p>
          </div>
        ) : (
          <div className="bg-[#1c1c1e] border border-outline-variant/15 rounded-2xl overflow-x-auto shadow-2xl">
            <table className="w-full text-left border-collapse text-[13px] min-w-[750px]">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low text-on-surface-variant/60 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Deliverable Title</th>
                  <th className="py-4 px-6">Classification</th>
                  <th className="py-4 px-6">Timeline Anchor</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredTasks.map((task) => (
                  <tr 
                    key={task._id || task.id}
                    onClick={() => { setActiveViewTask(task); setIsDetailOpen(true); }}
                    className="hover:bg-[#242426] transition-colors cursor-pointer group"
                  >

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        task.status === 'completed'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-surface-container-highest/60 text-on-surface-variant/80 border-outline-variant/30'
                      }`}>
                        {task.status}
                      </span>
                    </td>


                    <td className="py-4 px-6 min-w-[200px]">
                      <div className="max-w-md">
                        <p className={`font-semibold text-on-surface ${task.status === 'completed' ? 'line-through text-on-surface-variant/40' : ''}`}>
                          {task.title}
                        </p>
                        <p className="text-[11px] text-on-surface-variant/60 truncate mt-0.5">{task.description}</p>
                      </div>
                    </td>


                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        task.priority === 'high'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : task.priority === 'medium'
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {task.priority} Priority
                      </span>
                    </td>


                    <td className="py-4 px-6 text-on-surface-variant/80 whitespace-nowrap">
                      {task.due && task.due !== 'No Due Date' ? new Date(task.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Due Date'}
                    </td>


                    <td className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-3.5">
                        <button 
                          onClick={(e) => handleToggleStatus(task, e)}
                          className="text-on-surface-variant/40 hover:text-primary transition-colors"
                          title={task.status === 'completed' ? 'Mark Pending' : 'Verify Milestone'}
                        >
                          <span className="material-symbols-outlined !text-[18px]">
                            {task.status === 'completed' ? 'radio_button_checked' : 'radio_button_unchecked'}
                          </span>
                        </button>
                        <button 
                          onClick={(e) => handleDeleteTask(task._id || task.id, e)}
                          className="text-on-surface-variant/40 hover:text-error transition-colors"
                          title="Purge Node"
                        >
                          <span className="material-symbols-outlined !text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          onUpdateSuccess={fetchServerTasks}
        />

      </div>
    </Layout>
  );
};

export default MyTasks;
