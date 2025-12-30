import { useState, useEffect, useCallback } from 'react';
import { Contact, ReminderFrequency } from '@/types/contact';
import {
  getContacts,
  addContact as addContactUtil,
  updateContact as updateContactUtil,
  deleteContact as deleteContactUtil,
  markAsContacted as markAsContactedUtil,
  sortContactsByReminder,
} from '@/lib/contacts';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadContacts = useCallback(() => {
    const loaded = getContacts();
    setContacts(sortContactsByReminder(loaded));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadContacts();
    
    // Refresh contacts every 10 seconds to update status badges in sync with notifications
    const interval = setInterval(() => {
      loadContacts();
    }, 10 * 1000);
    
    return () => clearInterval(interval);
  }, [loadContacts]);

  const addContact = useCallback((name: string, frequency: ReminderFrequency, notes?: string) => {
    const newContact = addContactUtil(name, frequency, notes);
    setContacts(prev => sortContactsByReminder([...prev, newContact]));
    return newContact;
  }, []);

  const updateContact = useCallback((id: string, updates: Partial<Omit<Contact, 'id' | 'createdAt'>>) => {
    const updated = updateContactUtil(id, updates);
    if (updated) {
      setContacts(prev => sortContactsByReminder(prev.map(c => c.id === id ? updated : c)));
    }
    return updated;
  }, []);

  const deleteContact = useCallback((id: string) => {
    const success = deleteContactUtil(id);
    if (success) {
      setContacts(prev => prev.filter(c => c.id !== id));
    }
    return success;
  }, []);

  const markAsContacted = useCallback((id: string) => {
    const updated = markAsContactedUtil(id);
    if (updated) {
      setContacts(prev => sortContactsByReminder(prev.map(c => c.id === id ? updated : c)));
    }
    return updated;
  }, []);

  return {
    contacts,
    isLoading,
    addContact,
    updateContact,
    deleteContact,
    markAsContacted,
    refresh: loadContacts,
  };
}
