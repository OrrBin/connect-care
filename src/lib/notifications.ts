import { Contact } from '@/types/contact';
import { getReminderStatus } from './contacts';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export function sendNotification(title: string, options?: NotificationOptions): Notification | null {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return null;
  }

  return new Notification(title, {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    ...options,
  });
}

export function checkAndNotifyDueContacts(contacts: Contact[]): void {
  const notifiedKey = 'notified_contacts_today';
  const today = new Date().toDateString();
  
  // Get already notified contacts for today
  const notifiedData = localStorage.getItem(notifiedKey);
  const notified: { date: string; ids: string[] } = notifiedData 
    ? JSON.parse(notifiedData) 
    : { date: today, ids: [] };
  
  // Reset if it's a new day
  if (notified.date !== today) {
    notified.date = today;
    notified.ids = [];
  }

  const dueContacts = contacts.filter(contact => {
    const status = getReminderStatus(contact);
    return (status === 'overdue' || status === 'today') && !notified.ids.includes(contact.id);
  });

  if (dueContacts.length > 0) {
    if (dueContacts.length === 1) {
      sendNotification(`Time to reach out to ${dueContacts[0].name}!`, {
        body: `It's been a while since you connected. Send them a message today!`,
        tag: 'contact-reminder',
      });
    } else {
      sendNotification(`${dueContacts.length} contacts to reach out to!`, {
        body: `${dueContacts.map(c => c.name).join(', ')} are waiting to hear from you.`,
        tag: 'contact-reminder',
      });
    }

    // Mark as notified
    notified.ids.push(...dueContacts.map(c => c.id));
    localStorage.setItem(notifiedKey, JSON.stringify(notified));
  }
}
