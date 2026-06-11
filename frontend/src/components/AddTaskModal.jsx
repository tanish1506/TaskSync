import React, { useState } from 'react';
import API from '../services/api';

const AddTaskModal = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('Priority High');
  const [due, setDue] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    setLoading(true);
    try {
      const payload = {
        title,
        description,
        tag,
        due: due || 'No Due Date',
        status: 'pending'
      };

      // Create task via API
      await API.post('/tasks', payload);

      // Reset form
      setTitle('');
      setDescription('');
      setTag('Priority High');
      setDue('');
      
      // Refresh list and close
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Submission Error:", err);
      alert(err.response?.data?.message || "Failed to create new task.");
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

        <div className="mb-6">
          <h3 className="font-headline-sm text-[22px] text-on-surface tracking-wide">Initialize New Milestone</h3>
          <p className="font-body-md text-[13px] text-on-surface-variant mt-1">Append an actionable requirement node to the server cloud.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title input */}
          <div>
            <label className="block text-[11px] text-on-surface uppercase tracking-widest mb-2 font-semibold">Deliverable Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Client Render Signoff"
              className="w-full bg-background border border-outline-variant/60 text-on-surface rounded-none py-2.5 px-3.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-[14px]"
            />
          </div>

          {/* Description input */}
          <div>
            <label className="block text-[11px] text-on-surface uppercase tracking-widest mb-2 font-semibold">Strategic Execution Details</label>
            <textarea 
              required
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the end-to-end scope of parameters..."
              className="w-full bg-background border border-outline-variant/60 text-on-surface rounded-none py-2.5 px-3.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-[14px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category/Tag selection */}
            <div>
              <label className="block text-[11px] text-on-surface uppercase tracking-widest mb-2 font-semibold">Tonal Classification</label>
              <select 
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-background border border-outline-variant/60 text-on-surface rounded-none py-2.5 px-3.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-[13px]"
              >
                <option value="Priority High">Priority High</option>
                <option value="In Progress">In Progress</option>
                <option value="Logistics">Logistics</option>
                <option value="Audit Check">Audit Check</option>
              </select>
            </div>

            {/* Due date field */}
            <div>
              <label className="block text-[11px] text-on-surface uppercase tracking-widest mb-2 font-semibold">Timeline Anchor</label>
              <input 
                type="date" 
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className="w-full bg-background border border-outline-variant/60 text-on-surface rounded-none py-2.5 px-3.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none text-[13px]"
              />
            </div>
          </div>

          {/* Form actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-outline-variant/50 text-on-surface-variant text-[12px] uppercase tracking-widest font-semibold hover:bg-surface-container transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary text-on-primary text-[12px] uppercase tracking-widest font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Pushing Data...' : 'Commit Deliverable'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddTaskModal;
