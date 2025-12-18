import React, { useState } from 'react';
import { ScheduleBlock, Priority, DailyPlan } from '../types';
import { Coffee, Briefcase, Zap, AlertTriangle, Clock, CheckCircle, Volume2, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { generatePlanSpeech } from '../services/geminiService';

interface PlanVisualizationProps {
  plan: DailyPlan | null;
  isLoading: boolean;
}

// PCM Decoding Helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const getPriorityColor = (priority?: Priority) => {
  switch (priority) {
    case Priority.High: return 'border-l-4 border-l-red-500 bg-red-50';
    case Priority.Medium: return 'border-l-4 border-l-blue-500 bg-blue-50';
    case Priority.Low: return 'border-l-4 border-l-green-500 bg-green-50';
    default: return 'border-l-4 border-l-slate-300 bg-slate-50';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'break': return <Coffee className="text-amber-600" size={18} />;
    case 'meeting': return <Briefcase className="text-purple-600" size={18} />;
    case 'buffer': return <Clock className="text-slate-400" size={18} />;
    default: return <Zap className="text-brand-600" size={18} />;
  }
};

export const PlanVisualization: React.FC<PlanVisualizationProps> = ({ plan, isLoading }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const handleReadPlan = async () => {
    if (!plan) return;
    setIsGeneratingAudio(true);
    
    try {
      // Create a natural language summary of the plan
      const taskCount = plan.schedule.filter(s => s.type === 'task').length;
      const startTime = plan.schedule[0]?.startTime || '9 AM';
      const endTime = plan.schedule[plan.schedule.length - 1]?.endTime || '6 PM';
      
      const summary = `Here is your optimal schedule for today. 
      I have planned ${taskCount} tasks with ${plan.metrics.totalFocusHours} hours of focus time. 
      Your confidence score is ${plan.metrics.confidenceScore} percent. 
      You start at ${startTime} with ${plan.schedule[0]?.title}.
      Your day is scheduled to end at ${endTime}. 
      Have a productive day!`;

      const audioBase64 = await generatePlanSpeech(summary);

      if (audioBase64) {
        setIsPlayingAudio(true);
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass({ sampleRate: 24000 });
        
        const audioBuffer = await decodeAudioData(
          decode(audioBase64),
          audioContext,
          24000,
          1
        );

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        
        source.onended = () => {
          setIsPlayingAudio(false);
          audioContext.close();
        };
      }
    } catch (error) {
      console.error("Audio playback error", error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-slate-200 rounded mb-2"></div>
          <div className="h-3 w-32 bg-slate-200 rounded"></div>
        </div>
        <p className="mt-8 text-sm font-medium animate-pulse">AI is optimizing your day...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
        <Briefcase size={48} className="mb-4 opacity-20" />
        <p>Add tasks and click "Generate Plan" to start.</p>
      </div>
    );
  }

  const { schedule, metrics, deferredTasks } = plan;

  // Data for Chart
  const pieData = [
    { name: 'Used', value: metrics.utilizationRate },
    { name: 'Free', value: 100 - metrics.utilizationRate }
  ];
  const COLORS = ['#0ea5e9', '#e2e8f0'];

  return (
    <div className="space-y-6">
      {/* Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Focus Hours</p>
            <p className="text-2xl font-bold text-slate-900">{metrics.totalFocusHours.toFixed(1)}h</p>
          </div>
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Zap size={20} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Confidence</p>
            <p className="text-2xl font-bold text-slate-900">{metrics.confidenceScore}%</p>
          </div>
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${metrics.confidenceScore > 80 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-row items-center gap-4">
          <div className="flex-1">
             <p className="text-xs text-slate-500 uppercase font-semibold">Load</p>
             <p className="text-2xl font-bold text-slate-900">{metrics.utilizationRate}%</p>
          </div>
          <div className="h-12 w-12">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={15} outerRadius={24} fill="#8884d8" paddingAngle={0} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-slate-700">Today's Schedule</h3>
            <span className="text-xs font-medium px-2 py-1 bg-white border rounded text-slate-500">
              {schedule.length} Blocks
            </span>
          </div>
          
          <button 
            onClick={handleReadPlan}
            disabled={isGeneratingAudio || isPlayingAudio}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all 
              ${isGeneratingAudio || isPlayingAudio ? 'bg-brand-50 text-brand-400' : 'bg-brand-50 text-brand-600 hover:bg-brand-100'}`}
          >
            {isGeneratingAudio ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Volume2 size={14} className={isPlayingAudio ? 'animate-pulse' : ''} />
            )}
            {isGeneratingAudio ? 'Generating...' : isPlayingAudio ? 'Reading Plan...' : 'Read Plan'}
          </button>
        </div>
        <div className="p-4 space-y-3">
          {schedule.map((block) => (
            <div key={block.id} className="flex group">
              {/* Time Column */}
              <div className="w-16 flex flex-col items-center pt-2 mr-3">
                <span className="text-xs font-bold text-slate-700">{block.startTime}</span>
                <div className="h-full w-px bg-slate-200 my-1 group-last:hidden"></div>
              </div>
              
              {/* Card */}
              <div className={`flex-1 p-3 rounded-lg border border-slate-100 shadow-sm transition-all hover:shadow-md ${getPriorityColor(block.priority)}`}>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(block.type)}
                    <h4 className="font-semibold text-slate-800 text-sm">{block.title}</h4>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{block.endTime}</span>
                </div>
                
                <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                  {block.reasoning}
                </p>

                {block.energyContext && (
                  <div className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white/50 px-1.5 py-0.5 rounded">
                    <BatteryIcon level="High" /> {block.energyContext}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deferred Tasks */}
      {deferredTasks.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" /> Deferred Tasks
          </h4>
          <ul className="space-y-2">
            {deferredTasks.map((task, idx) => (
              <li key={idx} className="text-xs bg-white p-2 rounded border border-slate-100 text-slate-600 flex justify-between">
                <span className="font-medium">{task.title}</span>
                <span className="italic opacity-75">{task.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Helper for battery icon
const BatteryIcon = ({ level }: { level: string }) => {
  return <Zap size={10} className="inline" />;
};