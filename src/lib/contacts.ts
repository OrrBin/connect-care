import { Contact, ReminderFrequency, frequencyDays } from '@/types/contact';
import { addDays, parseISO, isBefore, startOfDay, isToday } from 'date-fns';

const STORAGE_KEY = 'keepintouch-contacts';

export function generateRandomReminderDate(frequency: ReminderFrequency, fromDate: Date = new Date()): string {
  const { min, max } = frequencyDays[frequency];
  const randomDays = Math.floor(Math.random() * (max - min + 1)) + min;
  return addDays(startOfDay(fromDate), randomDays).toISOString();
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getContacts(): Contact[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveContacts(contacts: Contact[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

export function addContact(name: string, frequency: ReminderFrequency, notes?: string): Contact {
  const contacts = getContacts();
  const newContact: Contact = {
    id: generateId(),
    name,
    notes,
    frequency,
    lastContacted: null,
    nextReminder: generateRandomReminderDate(frequency),
    createdAt: new Date().toISOString(),
  };
  contacts.push(newContact);
  saveContacts(contacts);
  return newContact;
}

export function updateContact(id: string, updates: Partial<Omit<Contact, 'id' | 'createdAt'>>): Contact | null {
  const contacts = getContacts();
  const index = contacts.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  // If frequency changed, regenerate reminder
  if (updates.frequency && updates.frequency !== contacts[index].frequency) {
    updates.nextReminder = generateRandomReminderDate(updates.frequency);
  }
  
  contacts[index] = { ...contacts[index], ...updates };
  saveContacts(contacts);
  return contacts[index];
}

export function deleteContact(id: string): boolean {
  const contacts = getContacts();
  const filtered = contacts.filter(c => c.id !== id);
  if (filtered.length === contacts.length) return false;
  saveContacts(filtered);
  return true;
}

export function markAsContacted(id: string): Contact | null {
  const contacts = getContacts();
  const contact = contacts.find(c => c.id === id);
  if (!contact) return null;
  
  const now = new Date();
  contact.lastContacted = now.toISOString();
  contact.nextReminder = generateRandomReminderDate(contact.frequency, now);
  saveContacts(contacts);
  return contact;
}

export function getReminderStatus(contact: Contact): 'overdue' | 'today' | 'upcoming' | 'future' {
  const reminderDate = startOfDay(parseISO(contact.nextReminder));
  const today = startOfDay(new Date());
  
  if (isBefore(reminderDate, today)) return 'overdue';
  if (isToday(reminderDate)) return 'today';
  
  const weekFromNow = addDays(today, 7);
  if (isBefore(reminderDate, weekFromNow)) return 'upcoming';
  
  return 'future';
}

export function sortContactsByReminder(contacts: Contact[]): Contact[] {
  return [...contacts].sort((a, b) => {
    const dateA = parseISO(a.nextReminder);
    const dateB = parseISO(b.nextReminder);
    return dateA.getTime() - dateB.getTime();
  });
}
