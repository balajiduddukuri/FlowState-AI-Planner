import { Task, Priority, EnergyLevel, UserSettings, Scenario } from './types';

export const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Deep Work: Q3 Roadmap Strategy', priority: Priority.High, durationMinutes: 90, energyRequired: EnergyLevel.High },
  { id: '2', title: 'Team Standup', priority: Priority.Medium, durationMinutes: 15, energyRequired: EnergyLevel.Low, locked: true },
  { id: '3', title: 'Email Triage & Slack', priority: Priority.Low, durationMinutes: 30, energyRequired: EnergyLevel.Low },
  { id: '4', title: 'Review User Interview Notes', priority: Priority.High, durationMinutes: 45, energyRequired: EnergyLevel.Medium },
  { id: '5', title: 'Sync with Engineering Lead', priority: Priority.Medium, durationMinutes: 30, energyRequired: EnergyLevel.Medium },
  { id: '6', title: 'Draft PRD for Mobile Search', priority: Priority.High, durationMinutes: 60, energyRequired: EnergyLevel.High },
  { id: '7', title: 'Backlog Grooming', priority: Priority.Medium, durationMinutes: 45, energyRequired: EnergyLevel.Low }
];

export const DEFAULT_SETTINGS: UserSettings = {
  workStart: "09:00",
  workEnd: "18:00",
  breakDuration: 60
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'pm_busy',
    name: 'Product Manager',
    role: 'PM',
    icon: '🚀',
    tasks: [
      { title: 'Deep Work: Q3 Roadmap Strategy', priority: Priority.High, durationMinutes: 90, energyRequired: EnergyLevel.High },
      { title: 'Team Standup', priority: Priority.Medium, durationMinutes: 15, energyRequired: EnergyLevel.Low, locked: true },
      { title: 'Email Triage & Slack', priority: Priority.Low, durationMinutes: 30, energyRequired: EnergyLevel.Low },
      { title: 'Review User Interview Notes', priority: Priority.High, durationMinutes: 45, energyRequired: EnergyLevel.Medium },
      { title: 'Sync with Engineering Lead', priority: Priority.Medium, durationMinutes: 30, energyRequired: EnergyLevel.Medium },
      { title: 'Draft PRD for Mobile Search', priority: Priority.High, durationMinutes: 60, energyRequired: EnergyLevel.High },
    ]
  },
  {
    id: 'dev_sprint',
    name: 'Software Engineer',
    role: 'Dev',
    icon: '💻',
    tasks: [
      { title: 'Fix Critical Auth Bug', priority: Priority.High, durationMinutes: 60, energyRequired: EnergyLevel.High },
      { title: 'Daily Standup', priority: Priority.Medium, durationMinutes: 15, energyRequired: EnergyLevel.Low, locked: true },
      { title: 'Code Review (Team PRs)', priority: Priority.Medium, durationMinutes: 45, energyRequired: EnergyLevel.Medium },
      { title: 'Feature Implementation: Dark Mode', priority: Priority.High, durationMinutes: 120, energyRequired: EnergyLevel.High },
      { title: 'Update Documentation', priority: Priority.Low, durationMinutes: 30, energyRequired: EnergyLevel.Low },
      { title: 'Deployment Pipeline Check', priority: Priority.Medium, durationMinutes: 20, energyRequired: EnergyLevel.Medium },
    ]
  },
  {
    id: 'student_finals',
    name: 'University Student',
    role: 'Student',
    icon: '📚',
    tasks: [
      { title: 'Review Calculus Lectures', priority: Priority.High, durationMinutes: 90, energyRequired: EnergyLevel.High },
      { title: 'Practice Problem Set', priority: Priority.High, durationMinutes: 60, energyRequired: EnergyLevel.High },
      { title: 'Group Study Call', priority: Priority.Medium, durationMinutes: 60, energyRequired: EnergyLevel.Medium },
      { title: 'Flashcards: History', priority: Priority.Medium, durationMinutes: 30, energyRequired: EnergyLevel.Low },
      { title: 'Quick Nap', priority: Priority.Low, durationMinutes: 20, energyRequired: EnergyLevel.Low },
      { title: 'Outline Term Paper', priority: Priority.Medium, durationMinutes: 45, energyRequired: EnergyLevel.Medium },
    ]
  },
  {
    id: 'creator_video',
    name: 'Content Creator',
    role: 'Creator',
    icon: '📹',
    tasks: [
      { title: 'Script Writing: New Video', priority: Priority.High, durationMinutes: 90, energyRequired: EnergyLevel.High },
      { title: 'Record B-Roll Footage', priority: Priority.Medium, durationMinutes: 60, energyRequired: EnergyLevel.Medium },
      { title: 'Edit Main Cut', priority: Priority.High, durationMinutes: 120, energyRequired: EnergyLevel.High },
      { title: 'Design Thumbnails', priority: Priority.Medium, durationMinutes: 45, energyRequired: EnergyLevel.Medium },
      { title: 'Reply to Comments', priority: Priority.Low, durationMinutes: 30, energyRequired: EnergyLevel.Low },
      { title: 'Sponsor Email Replies', priority: Priority.Medium, durationMinutes: 30, energyRequired: EnergyLevel.Low },
    ]
  },
  {
    id: 'founder_fundraising',
    name: 'Startup Founder',
    role: 'Founder',
    icon: '🦄',
    tasks: [
      { title: 'Refine Pitch Deck', priority: Priority.High, durationMinutes: 60, energyRequired: EnergyLevel.High },
      { title: 'Investor Meeting: VC Firm A', priority: Priority.High, durationMinutes: 60, energyRequired: EnergyLevel.High, locked: true },
      { title: 'Investor Meeting: Angel B', priority: Priority.High, durationMinutes: 45, energyRequired: EnergyLevel.High },
      { title: 'Team All-Hands', priority: Priority.Medium, durationMinutes: 45, energyRequired: EnergyLevel.Medium },
      { title: 'Sign Legal Docs', priority: Priority.High, durationMinutes: 15, energyRequired: EnergyLevel.Low },
      { title: 'Review Product KPIs', priority: Priority.Medium, durationMinutes: 30, energyRequired: EnergyLevel.Medium },
    ]
  },
  {
    id: 'freelance_designer',
    name: 'Freelance Designer',
    role: 'Designer',
    icon: '🎨',
    tasks: [
      { title: 'Client A: Brand Discovery Call', priority: Priority.High, durationMinutes: 60, energyRequired: EnergyLevel.Medium, locked: true },
      { title: 'Logo Sketching Phase 1', priority: Priority.High, durationMinutes: 90, energyRequired: EnergyLevel.High },
      { title: 'Client B: Feedback Revisions', priority: Priority.Medium, durationMinutes: 45, energyRequired: EnergyLevel.Medium },
      { title: 'Invoicing & Admin', priority: Priority.Low, durationMinutes: 30, energyRequired: EnergyLevel.Low },
      { title: 'Portfolio Update', priority: Priority.Low, durationMinutes: 60, energyRequired: EnergyLevel.Medium },
    ]
  },
  {
    id: 'sales_closing',
    name: 'Sales Executive',
    role: 'Sales',
    icon: '💼',
    tasks: [
      { title: 'Cold Call Block', priority: Priority.High, durationMinutes: 60, energyRequired: EnergyLevel.High },
      { title: 'Demo: Enterprise Prospect', priority: Priority.High, durationMinutes: 45, energyRequired: EnergyLevel.High, locked: true },
      { title: 'Contract Negotiation Call', priority: Priority.High, durationMinutes: 30, energyRequired: EnergyLevel.High },
      { title: 'Update CRM', priority: Priority.Medium, durationMinutes: 30, energyRequired: EnergyLevel.Low },
      { title: 'Draft Proposals', priority: Priority.Medium, durationMinutes: 45, energyRequired: EnergyLevel.Medium },
      { title: 'Pipeline Review', priority: Priority.Low, durationMinutes: 30, energyRequired: EnergyLevel.Low },
    ]
  },
  {
    id: 'parent_weekend',
    name: 'Stay-at-Home Parent',
    role: 'Parent',
    icon: '🏡',
    tasks: [
      { title: 'Morning Routine & Breakfast', priority: Priority.High, durationMinutes: 60, energyRequired: EnergyLevel.Medium },
      { title: 'School Drop-off', priority: Priority.High, durationMinutes: 30, energyRequired: EnergyLevel.Low, locked: true },
      { title: 'Grocery Run', priority: Priority.Medium, durationMinutes: 60, energyRequired: EnergyLevel.Medium },
      { title: 'House Cleaning', priority: Priority.Low, durationMinutes: 45, energyRequired: EnergyLevel.Low },
      { title: 'Meal Prep', priority: Priority.Medium, durationMinutes: 60, energyRequired: EnergyLevel.Medium },
      { title: 'Budget Planning', priority: Priority.Medium, durationMinutes: 30, energyRequired: EnergyLevel.High },
    ]
  }
];