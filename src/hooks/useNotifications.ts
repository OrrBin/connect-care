import { useState, useEffect, useCallback } from 'react';
import { Contact } from '@/types/contact';
import {
  requestNotificationPermission,
  getNotificationPermission,
  checkAndNotifyDueContacts,
} from '@/lib/notifications';

export function useNotifications(contacts: Contact[]) {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  const requestPermission = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setPermission(granted ? 'granted' : 'denied');
    return granted;
  }, []);

  // Check for due contacts when the hook mounts and periodically
  useEffect(() => {
    if (permission !== 'granted' || contacts.length === 0) return;

    // Check immediately
    checkAndNotifyDueContacts(contacts);

    // Check every hour
    const interval = setInterval(() => {
      checkAndNotifyDueContacts(contacts);
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [contacts, permission]);

  return {
    permission,
    requestPermission,
    isSupported: permission !== 'unsupported',
  };
}
