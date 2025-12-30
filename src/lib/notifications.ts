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
  console.log('checkAndNotifyDueContacts called with', contacts.length, 'contacts');
  
  const notifiedKey = 'notified_contacts';
  
  // Get already notified contacts with their reminder times
  const notifiedData = localStorage.getItem(notifiedKey);
  const notified: Record<string, string> = notifiedData ? JSON.parse(notifiedData) : {};
  
  const now = new Date();
  console.log('Current time:', now.toISOString());
  
  const dueContacts = contacts.filter(contact => {
    const status = getReminderStatus(contact);
    console.log(`Contact ${contact.name}: status=${status}, nextReminder=${contact.nextReminder}`);
    
    if (status !== 'overdue' && status !== 'today') return false;
    
    // Notify if reminder time has arrived (now >= reminderDate)
    const reminderDate = new Date(contact.nextReminder);
    if (reminderDate > now) {
      console.log(`  Skipping ${contact.name} - reminder is in future`);
      return false;
    }
    
    // Check if already notified for this specific reminder time
    const lastNotified = notified[contact.id];
    if (lastNotified && lastNotified === contact.nextReminder) {
      console.log(`  Skipping ${contact.name} - already notified for this reminder`);
      return false;
    }
    
    console.log(`  ${contact.name} is due for notification!`);
    return true;
  });

  console.log('Due contacts:', dueContacts.length);

  if (dueContacts.length > 0) {
    if (dueContacts.length === 1) {
      console.log('Sending notification for:', dueContacts[0].name);
      sendNotification(`Time to reach out to ${dueContacts[0].name}!`, {
        body: `It's been a while since you connected. Send them a message today!`,
        tag: 'contact-reminder',
      });
    } else {
      console.log('Sending notification for multiple contacts');
      sendNotification(`${dueContacts.length} contacts to reach out to!`, {
        body: `${dueContacts.map(c => c.name).join(', ')} are waiting to hear from you.`,
        tag: 'contact-reminder',
      });
    }

    // Mark as notified with their specific reminder time
    dueContacts.forEach(contact => {
      notified[contact.id] = contact.nextReminder;
    });
    localStorage.setItem(notifiedKey, JSON.stringify(notified));
    console.log('Updated notified contacts in localStorage');
  }
}
