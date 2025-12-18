import React, { useState } from 'react';
import { Task, UserSettings, DailyPlan, Priority } from './types';
import { TaskForm } from './components/TaskForm';
import { PlanVisualization } from './components/PlanVisualization';
import { Button } from './components/Button';
import { generateDailyPlan } from './services/geminiService';
import { INITIAL_TASKS, DEFAULT_SETTINGS, SCENARIOS } from './constants';
import { Sparkles, Settings, List, Trash2, ChevronDown, Pencil, Brain, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'plan'>('input');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTasks(prev => [...prev, task]);
    // Invalidate current plan if inputs change
    if (plan) setPlan(null); 
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTaskId(null);
    if (plan) setPlan(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (editingTaskId === id) setEditingTaskId(null);
    if (plan) setPlan(null);
  };

  const handleLoadScenario = (scenarioId: string) => {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      const newTasks = scenario.tasks.map(t => ({
        ...t,
        id: Math.random().toString(36).substr(2, 9)
      }));
      setTasks(newTasks);
      setEditingTaskId(null);
      setPlan(null); // Reset plan
    }
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      // Simulate small delay for UX if API is too fast
      const [generatedPlan] = await Promise.all([
        generateDailyPlan(tasks, settings, useThinking),
        new Promise(resolve => setTimeout(resolve, 800)) 
      ]);
      setPlan(generatedPlan);
      setActiveTab('plan');
    } catch (err) {
      setError("Failed to generate plan. Please try again or check your API key.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-1.5 rounded-lg text-white">
              <Sparkles size={20} />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">FlowState</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                <span>Working: {settings.workStart} - {settings.workEnd}</span>
             </div>
             
             {/* Model Toggle */}
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setUseThinking(false)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${!useThinking ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  title="Fast Mode (Gemini Flash Lite)"
                >
                  <Zap size={14} className={!useThinking ? 'text-amber-500' : ''} />
                  Fast
                </button>
                <button
                  onClick={() => setUseThinking(true)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${useThinking ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  title="Deep Thinking Mode (Gemini 3.0 Pro)"
                >
                  <Brain size={14} className={useThinking ? 'text-brand-600' : ''} />
                  Deep Think
                </button>
             </div>

             <Button 
               onClick={handleGeneratePlan} 
               isLoading={isGenerating}
               className="shadow-brand-500/20 shadow-lg hidden sm:flex"
             >
               {plan ? 'Regenerate' : 'Generate Plan'}
             </Button>
          </div>
        </div>
        {/* Mobile Generate Button */}
        <div className="sm:hidden px-4 py-2 bg-white border-t border-slate-100 flex justify-end">
            <Button 
               onClick={handleGeneratePlan} 
               isLoading={isGenerating}
               className="w-full shadow-brand-500/20 shadow-lg"
             >
               {plan ? 'Regenerate' : 'Generate Plan'}
             </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Mobile Tabs */}
        <div className="md:hidden flex space-x-1 bg-slate-200 p-1 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'input' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Tasks & Settings
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'plan' ? 'bg-white shadow-sm text-brand-600' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Schedule
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 flex items-center gap-3">
             <div className="bg-red-100 p-1 rounded-full"><Settings size={16} /></div>
             {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Inputs */}
          <div className={`md:col-span-5 ${activeTab === 'input' ? 'block' : 'hidden md:block'}`}>
            <section>
               <TaskForm 
                 onAddTask={handleAddTask} 
                 onUpdateTask={handleUpdateTask}
                 onCancelEdit={handleCancelEdit}
                 editingTask={tasks.find(t => t.id === editingTaskId)}
               />
               
               {/* Removed overflow-hidden from parent to allow dropdown to show */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                 <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center rounded-t-xl">
                   <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                     <List size={18} /> Task Queue
                   </h3>
                   <div className="flex items-center gap-2">
                     <div className="relative group">
                       <button className="text-xs font-medium text-slate-600 hover:text-brand-600 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors">
                         Load Preset <ChevronDown size={12} />
                       </button>
                       {/* Dropdown Menu */}
                       <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50 hidden group-hover:block group-focus-within:block">
                          <div className="py-1 max-h-80 overflow-y-auto">
                            {SCENARIOS.map(s => (
                              <button
                                key={s.id}
                                onClick={() => handleLoadScenario(s.id)}
                                className="w-full text-left px-4 py-3 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 flex items-center gap-3 border-b border-slate-50 last:border-0"
                              >
                                <span className="text-lg">{s.icon}</span> 
                                <div className="flex flex-col">
                                    <span className="font-medium">{s.name}</span>
                                    <span className="text-[10px] text-slate-400">{s.tasks.length} tasks</span>
                                </div>
                              </button>
                            ))}
                          </div>
                       </div>
                     </div>
                     <span className="text-xs bg-slate-200 px-2 py-1 rounded-full text-slate-600 font-mono">{tasks.length}</span>
                   </div>
                 </div>
                 <ul className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto rounded-b-xl">
                   {tasks.length === 0 && (
                     <li className="p-8 text-center text-slate-400 text-sm">
                       No tasks yet. Add some above!
                     </li>
                   )}
                   {tasks.map(task => (
                     <li key={task.id} className={`p-4 transition-colors group ${editingTaskId === task.id ? 'bg-brand-50' : 'hover:bg-slate-50'}`}>
                       <div className="flex justify-between items-start">
                         <div>
                           <p className={`font-medium ${editingTaskId === task.id ? 'text-brand-700' : 'text-slate-800'}`}>{task.title}</p>
                           <div className="flex gap-2 mt-1">
                             <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide
                               ${task.priority === Priority.High ? 'bg-red-100 text-red-700' : 
                                 task.priority === Priority.Medium ? 'bg-blue-100 text-blue-700' : 
                                 'bg-green-100 text-green-700'}`}>
                               {task.priority}
                             </span>
                             <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                               {task.durationMinutes}m
                             </span>
                             {task.locked && <span className="text-[10px] text-slate-400">🔒 Locked</span>}
                           </div>
                         </div>
                         <div className="flex items-center">
                            <button 
                              onClick={() => setEditingTaskId(task.id)}
                              className={`p-2 transition-all ${editingTaskId === task.id ? 'text-brand-600 opacity-100' : 'text-slate-300 hover:text-brand-500 opacity-0 group-hover:opacity-100'}`}
                              title="Edit Task"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => removeTask(task.id)}
                              className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2"
                              title="Delete Task"
                            >
                              <Trash2 size={16} />
                            </button>
                         </div>
                       </div>
                     </li>
                   ))}
                 </ul>
               </div>
            </section>
          </div>

          {/* Right Column: Visualization */}
          <div className={`md:col-span-7 ${activeTab === 'plan' ? 'block' : 'hidden md:block'}`}>
            <PlanVisualization plan={plan} isLoading={isGenerating} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;