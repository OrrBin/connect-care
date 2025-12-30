import { useContacts } from '@/hooks/useContacts';
import { useNotifications } from '@/hooks/useNotifications';
import { AddContactDialog } from '@/components/AddContactDialog';
import { ContactCard } from '@/components/ContactCard';
import { EmptyState } from '@/components/EmptyState';
import { NotificationPrompt } from '@/components/NotificationPrompt';
import { useToast } from '@/hooks/use-toast';
import { Heart } from 'lucide-react';

const Index = () => {
  const { contacts, addContact, markAsContacted, deleteContact } = useContacts();
  const { permission, requestPermission, refreshPermission } = useNotifications(contacts);
  const { toast } = useToast();

  const handleAdd = (name: string, frequency: any, notes?: string) => {
    addContact(name, frequency, notes);
    toast({
      title: 'Contact added',
      description: `We'll remind you to reach out to ${name}.`,
    });
  };

  const handleMarkContacted = (id: string) => {
    const contact = markAsContacted(id);
    if (contact) {
      toast({
        title: 'Nice!',
        description: `New reminder set for ${contact.name}.`,
      });
    }
  };

  const handleDelete = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    deleteContact(id);
    toast({
      title: 'Contact removed',
      description: contact ? `${contact.name} has been removed.` : 'Contact removed.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold text-lg text-foreground">Keep in Touch</h1>
                <p className="text-xs text-muted-foreground">Never lose touch with people who matter</p>
              </div>
            </div>
            <AddContactDialog onAdd={handleAdd} />
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-8 space-y-6">
        <NotificationPrompt 
          permission={permission} 
          onRequestPermission={requestPermission}
          onRefreshPermission={refreshPermission}
        />

        {contacts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
              </p>
            </div>
            
            <div className="space-y-3">
              {contacts.map((contact, index) => (
                <div 
                  key={contact.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ContactCard
                    contact={contact}
                    onMarkContacted={handleMarkContacted}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container max-w-3xl mx-auto px-4">
          <p className="text-center text-xs text-muted-foreground">
            Stay connected, one message at a time
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
