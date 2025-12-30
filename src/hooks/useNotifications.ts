import { useState, useEffect, useCallback } from 'react';
import { Contact } from '@/types/contact';
import {
  requestNotificationPermission,
  getNotificationPermission,
  checkAndNotifyDueContacts,
} from '@/lib/notifications';

export function useNotifications(contacts: Contact[]) {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');

  const refreshPermission = useCallback(() => {
    setPermission(getNotificationPermission());
  }, []);

  useEffect(() => {
    refreshPermission();

    // Re-check when tab becomes visible or window gains focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshPermission();
      }
    };

    const handleFocus = () => {
      refreshPermission();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Try to use Permissions API for real-time updates
    let permissionStatus: PermissionStatus | null = null;
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'notifications' as PermissionName })
        .then(status => {
          permissionStatus = status;
          status.onchange = refreshPermission;
        })
        .catch(() => {
          // Permissions API not supported for notifications
        });
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, [refreshPermission]);

  const requestPermission = useCallback(async () => {
    const granted = await requestNotificationPermission();
    refreshPermission(); // Always refresh to get actual state
    return granted;
  }, [refreshPermission]);

  // Check for due contacts when the hook mounts and periodically
  useEffect(() => {
    if (permission !== 'granted' || contacts.length === 0) return;

    // Check immediately
    console.log('Checking for due contacts...', contacts.length);
    checkAndNotifyDueContacts(contacts);

    // Determine check interval based on contact frequencies
    const hasMinuteFrequency = contacts.some(c => c.frequency === 'minute' || c.frequency === 'fiveMinutes');
    const checkInterval = hasMinuteFrequency ? 10 * 1000 : 60 * 60 * 1000; // 10 seconds if minute-based, else 1 hour

    console.log('Setting up notification check interval:', checkInterval / 1000, 'seconds');
    const interval = setInterval(() => {
      console.log('Running periodic notification check...');
      checkAndNotifyDueContacts(contacts);
    }, checkInterval);

    return () => clearInterval(interval);
  }, [contacts, permission]);

  return {
    permission,
    requestPermission,
    refreshPermission,
  };
}
