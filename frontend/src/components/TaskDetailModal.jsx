import React, { useState, useEffect } from 'react';
import API from '../services/api';

const TaskDetailModal = ({ isOpen, task, onClose, onToggleStatus, onDelete, onUpdateSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTag, setEditTag] = useState('Priority High');
  const [editDue, setEditDue] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync state variables when the task prop changes
  useEffect(() => {
    if (task) {
      setEditTitle(task.title || '');
      setEditDescription(task.description || '');
      setEditTag(task.tag || 'Priority High');
      
      // Format the date properly for <input type="date" /> (YYYY-MM-DD)
      if (task.due && task.due !== 'No Due Date') {
        const dateObj = new Date(task.due);
        if (!isNaN(dateObj.getTime())) {
          setEditDue(dateObj.toISOString().split('T')[0]);
        } else {
          setEditDue('');
        }
      } else {
        setEditDue('');
      }
    }
    setIsEditing(false); // Reset edit mode on modal open/change
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!editTitle || !editDescription) return;

    setLoading(true);
    try {
      const payload = {
        title: editTitle,
        description: editDescription,
        tag: editTag,
        due: editDue || 'No Due Date'
      };

      const taskId = task._id || task.id;
      const res = await API.put(`/tasks/${taskId}`, payload);
      
      if (res.data.success) {
        setIsEditing(false);
        onUpdateSuccess(); // Refresh the list in the dashboard
        
        // Locally update the active viewed task properties
        task.title = editTitle;
        task.description = editDescription;
        task.tag = editTag;
        task.due = editDue || 'No Due Date';
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-surface-container-low border border-outline-variant/60 w-full max-w-lg p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-on-surface-variant/60 hover:text-on-surface transition-colors"
          title="Close Modal"
        >
          <span className="material-symbols-outlined !text-[20px]">close</span>
        </button>

        {isEditing ? (
          /* Edit form mode */
          <form onSubmit={handleSaveChanges} className="space-y-5">
            <div className="mb-4">
              <h3 className="font-headline-sm text-[22px] text-on-surface tracking-wide">Edit Milestone Node</h3>
              <p className="font-body-md text-[13px] text-on-surface-variant mt-1">Modify properties of this active Workspace deliverable.</p>
            </div>

            <div>
              <label className="block text-[11px] text-on-surface uppercase tracking-widest mb-2 font-semibold">Title</label>
              <input 
                type="text" 
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-background border border-outline-variant/60 text-on-surface rounded-none py-2 px-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-[14px]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-on-surface uppercase tracking-widest mb-2 font-semibold">Scope Details</label>
              <textarea 
                required
                rows="4"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full bg-background border border-outline-variant/60 text-on-surface rounded-none py-2 px-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-[14px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-on-surface uppercase tracking-widest mb-2 font-semibold">Classification</label>
                <select 
                  value={editTag}
                  onChange={(e) => setEditTag(e.target.value)}
                  className="w-full bg-background border border-outline-variant/60 text-on-surface rounded-none py-2 px-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-[13px]"
                >
                  <option value="Priority High">Priority High</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Audit Check">Audit Check</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-on-surface uppercase tracking-widest mb-2 font-semibold">Timeline Anchor</label>
                <input 
                  type="date" 
                  value={editDue}
                  onChange={(e) => setEditDue(e.target.value)}
                  className="w-full bg-background border border-outline-variant/60 text-on-surface rounded-none py-2 px-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-[13px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 border border-outline-variant/50 text-on-surface-variant text-[12px] uppercase tracking-widest font-semibold hover:bg-surface-container transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-primary text-on-primary text-[12px] uppercase tracking-widest font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          /* Static details read mode */
          <>
            {/* Header metadata */}
            <div className="mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider">
                {task.tag || 'Deliverable'}
              </span>
              <h3 className="font-headline-sm text-[26px] text-on-surface tracking-wide mt-3 font-semibold">
                {task.title}
              </h3>
              <p className="text-[11px] text-on-surface-variant/60 uppercase tracking-widest font-bold mt-1.5">
                Node ID: {task._id || task.id}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h4 className="text-[11px] text-on-surface uppercase tracking-widest mb-1.5 font-bold">Execution Scope & Details</h4>
                <div className="bg-background border border-outline-variant/30 p-4 font-body-md text-[14px] text-on-surface-variant leading-relaxed min-h-[120px] whitespace-pre-wrap">
                  {task.description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[11px] text-on-surface uppercase tracking-widest mb-1 font-bold">Current Status</h4>
                  <p className={`text-[13px] font-semibold ${task.status === 'completed' ? 'text-green-400' : 'text-primary'}`}>
                    {task.status === 'completed' ? '✓ VERIFIED / CLOSED' : '⚡ PENDING BACKLOG'}
                  </p>
                </div>
                <div>
                  <h4 className="text-[11px] text-on-surface uppercase tracking-widest mb-1 font-bold">Timeline Target</h4>
                  <p className="text-[13px] text-on-surface font-medium">
                    {task.due && task.due !== 'No Due Date' ? new Date(task.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Due Date'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center border-t border-outline-variant/30 mt-8 pt-6">
              <button 
                onClick={(e) => { onDelete(task._id || task.id, e); onClose(); }}
                className="flex items-center gap-1.5 text-on-surface-variant/50 hover:text-error transition-colors text-[12px] uppercase tracking-widest font-semibold"
              >
                <span className="material-symbols-outlined !text-[16px]">delete</span>
                Purge Node
              </button>

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2 text-[11px] uppercase tracking-widest font-bold border border-outline-variant/65 text-on-surface hover:border-primary hover:text-primary transition-all"
                >
                  Edit Task
                </button>
                <button 
                  onClick={(e) => { onToggleStatus(task, e); }}
                  className={`px-5 py-2 text-[11px] uppercase tracking-widest font-bold border transition-all ${
                    task.status === 'completed' 
                      ? 'border-primary text-primary hover:bg-primary hover:text-on-primary' 
                      : 'border-green-500 text-green-400 hover:bg-green-500 hover:text-background'
                  }`}
                >
                  {task.status === 'completed' ? 'Mark Pending' : 'Verify Milestone'}
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default TaskDetailModal;
