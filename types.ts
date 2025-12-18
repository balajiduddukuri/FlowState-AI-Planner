export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export enum EnergyLevel {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  durationMinutes: number; // Estimated effort
  energyRequired: EnergyLevel;
  deadline?: string; // HH:mm format optional
  locked?: boolean;
}

export interface ScheduleBlock {
  id: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  title: string;
  type: 'task' | 'break' | 'meeting' | 'buffer';
  priority?: Priority;
  reasoning: string; // Why AI chose this slot
  energyContext?: string; // e.g., "High Energy Match"
}

export interface PlanMetrics {
  totalFocusHours: number;
  confidenceScore: number; // 0-100
  utilizationRate: number; // 0-100
}

export interface DailyPlan {
  schedule: ScheduleBlock[];
  metrics: PlanMetrics;
  deferredTasks: { title: string; reason: string }[];
}

export interface UserSettings {
  workStart: string; // HH:mm
  workEnd: string; // HH:mm
  breakDuration: number; // minutes
}

export interface Scenario {
  id: string;
  name: string;
  role: string;
  icon: string; // Emoji char
  tasks: Omit<Task, 'id'>[];
}