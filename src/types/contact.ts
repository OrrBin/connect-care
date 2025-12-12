export type ReminderFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly';

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
  weekly: 'Every week',
  biweekly: 'Every 2 weeks',
  monthly: 'Every month',
  quarterly: 'Every 3 months',
};

export const frequencyDays: Record<ReminderFrequency, { min: number; max: number }> = {
  weekly: { min: 5, max: 9 },
  biweekly: { min: 12, max: 16 },
  monthly: { min: 25, max: 35 },
  quarterly: { min: 80, max: 100 },
};
