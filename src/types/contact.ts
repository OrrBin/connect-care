export type ReminderFrequency = 'minute' | 'fiveMinutes' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly';

export interface Contact {
  id: string;
  name: string;
  notes?: string;
  frequency: ReminderFrequency;
  lastContacted: string | null;
  nextReminder: string;
  createdAt: string;
}

export const frequencyLabels: Record<ReminderFrequency, string> = {
  minute: 'Every minute',
  fiveMinutes: 'Every 5 minutes',
  weekly: 'Every week',
  biweekly: 'Every 2 weeks',
  monthly: 'Every month',
  quarterly: 'Every 3 months',
};

export const frequencyDays: Record<ReminderFrequency, { min: number; max: number }> = {
  minute: { min: 0.0007, max: 0.0007 }, // ~1 minute in days
  fiveMinutes: { min: 0.0035, max: 0.0035 }, // ~5 minutes in days
  weekly: { min: 5, max: 9 },
  biweekly: { min: 12, max: 16 },
  monthly: { min: 25, max: 35 },
  quarterly: { min: 80, max: 100 },
};
