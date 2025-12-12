import { Contact, frequencyLabels } from '@/types/contact';
import { getReminderStatus } from '@/lib/contacts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { Check, Clock, User, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContactCardProps {
  contact: Contact;
  onMarkContacted: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ContactCard({ contact, onMarkContacted, onDelete }: ContactCardProps) {
  const status = getReminderStatus(contact);
  const reminderDate = parseISO(contact.nextReminder);
  
  const statusConfig = {
    overdue: {
      badge: 'Overdue',
      badgeClass: 'bg-destructive text-destructive-foreground',
      cardClass: 'border-destructive/30 bg-destructive/5',
    },
    today: {
      badge: 'Today',
      badgeClass: 'bg-warning text-foreground',
      cardClass: 'border-warning/30 bg-warning/5',
    },
    upcoming: {
      badge: 'This week',
      badgeClass: 'bg-primary/15 text-primary',
      cardClass: 'border-primary/20',
    },
    future: {
      badge: null,
      badgeClass: '',
      cardClass: '',
    },
  };

  const config = statusConfig[status];

  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-card-hover animate-fade-in',
        config.cardClass
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg truncate">{contact.name}</h3>
                {config.badge && (
                  <Badge className={cn('text-xs', config.badgeClass)}>
                    {config.badge}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{frequencyLabels[contact.frequency]}</span>
              </div>
              
              {contact.notes && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {contact.notes}
                </p>
              )}
              
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span>
                  Next: <span className="font-medium">{format(reminderDate, 'MMM d, yyyy')}</span>
                  {status !== 'overdue' && (
                    <span className="ml-1">({formatDistanceToNow(reminderDate, { addSuffix: true })})</span>
                  )}
                </span>
                {contact.lastContacted && (
                  <span>
                    Last: {format(parseISO(contact.lastContacted), 'MMM d')}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              size="sm"
              onClick={() => onMarkContacted(contact.id)}
              className="gap-1.5"
            >
              <Check className="h-4 w-4" />
              Done
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(contact.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
