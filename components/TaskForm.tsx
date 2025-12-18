import React, { useState, useEffect } from 'react';
import { Plus, Clock, Battery, AlertCircle, Save, X } from 'lucide-react';
import { Task, Priority, EnergyLevel } from '../types';
import { Button } from './Button';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask?: (task: Task) => void;
  editingTask?: Task | null;
  onCancelEdit?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ 
  onAddTask, 
  onUpdateTask,
  editingTask,
  onCancelEdit
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.Medium);
  const [duration, setDuration] = useState<number>(30);
  const [energy, setEnergy] = useState<EnergyLevel>(EnergyLevel.Medium);

  // Populate form when editingTask changes
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setPriority(editingTask.priority);
      setDuration(editingTask.durationMinutes);
      setEnergy(editingTask.energyRequired);
    } else {
      resetForm();
    }
  }, [editingTask]);

  const resetForm = () => {
    setTitle('');
    setPriority(Priority.Medium);
    setDuration(30);
    setEnergy(EnergyLevel.Medium);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    if (editingTask && onUpdateTask) {
      onUpdateTask({
        ...editingTask,
        title,
        priority,
        durationMinutes: duration,
        energyRequired: energy,
      });
    } else {
      onAddTask({
        title,
        priority,
        durationMinutes: duration,
        energyRequired: energy,
      });
      resetForm();
    }
  };

  const handleCancel = () => {
    resetForm();
    if (onCancelEdit) onCancelEdit();
  };

  const isEditing = !!editingTask;

  return (
    <form onSubmit={handleSubmit} className={`bg-white p-5 rounded-xl shadow-sm border mb-6 transition-all duration-200 ${isEditing ? 'border-brand-300 ring-2 ring-brand-50' : 'border-slate-200'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          {isEditing ? (
            <>
              <Save className="bg-brand-100 text-brand-600 rounded p-0.5" size={20} /> Edit Task
            </>
          ) : (
            <>
              <Plus className="bg-brand-100 text-brand-600 rounded p-0.5" size={20} /> Add New Task
            </>
          )}
        </h3>
        {isEditing && (
          <button 
            type="button" 
            onClick={handleCancel}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <X size={14} /> Cancel
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-12 gap-4">
        {/* Row 1: Name */}
        <div className="col-span-12">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Task Name</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Write Q3 Report"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
            required
          />
        </div>

        {/* Row 2: Priority & Minutes */}
        <div className="col-span-6">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <AlertCircle size={14} className="text-slate-500" /> Priority
          </label>
          <div className="relative">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 appearance-none cursor-pointer"
            >
              {Object.values(Priority).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="col-span-6">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Clock size={14} className="text-slate-500" /> Minutes
          </label>
          <input
            type="number"
            min="5"
            step="5"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-slate-900"
          />
        </div>

        {/* Row 3: Energy & Button */}
        <div className="col-span-6">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Battery size={14} className="text-slate-500" /> Energy
          </label>
          <div className="relative">
            <select
              value={energy}
              onChange={(e) => setEnergy(e.target.value as EnergyLevel)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 appearance-none cursor-pointer"
            >
              {Object.values(EnergyLevel).map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="col-span-6 flex items-end">
          <Button 
            type="submit" 
            className="w-full h-[46px] justify-center"
            variant={isEditing ? 'primary' : 'primary'}
          >
            {isEditing ? <Save size={18} /> : <Plus size={18} />} 
            {isEditing ? 'Save' : 'Add'}
          </Button>
        </div>
      </div>
    </form>
  );
};