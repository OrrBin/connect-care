import { Bell, BellOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { sendNotification } from '@/lib/notifications';

interface NotificationPromptProps {
  permission: NotificationPermission | 'unsupported';
  onRequestPermission: () => Promise<boolean>;
}

export function NotificationPrompt({ permission, onRequestPermission }: NotificationPromptProps) {
  if (permission === 'unsupported') {
    return (
      <Card>
        <CardContent className="flex items-start gap-3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <BellOff className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">Notifications not supported</p>
            <p className="text-sm text-muted-foreground">
              Your current browser/device doesn’t support browser notifications.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleTestNotification = () => {
    sendNotification('Test Notification! 🔔', {
      body: 'Browser notifications are working correctly!',
      tag: 'test-notification',
    });
  };

  if (permission === 'granted') {
    return (
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-emerald-900">Notifications enabled</p>
              <p className="text-sm text-emerald-700">You'll be notified when it's time to reach out</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleTestNotification}>
            <Bell className="h-4 w-4 mr-2" />
            Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (permission === 'denied') {
    return (
      <Card className="border-muted bg-muted/30">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <BellOff className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Notifications blocked</p>
            <p className="text-sm text-muted-foreground">Enable them in your browser settings to get reminders</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Enable notifications</p>
            <p className="text-sm text-muted-foreground">Get reminded when it's time to reach out</p>
          </div>
        </div>
        <Button onClick={onRequestPermission} size="sm">
          Enable
        </Button>
      </CardContent>
    </Card>
  );
}
