import { useState } from 'react';
import { Contact, ReminderFrequency, frequencyLabels } from '@/types/contact';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/RichTextEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pencil } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface EditContactDialogProps {
  contact: Contact;
  onEdit: (id: string, updates: { name: string; frequency: ReminderFrequency; nextReminder: string; notes?: string }) => void;
}

export function EditContactDialog({ contact, onEdit }: EditContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(contact.name);
  const [frequency, setFrequency] = useState<ReminderFrequency>(contact.frequency);
  const [notes, setNotes] = useState(contact.notes || '');
  const [nextReminder, setNextReminder] = useState(
    format(parseISO(contact.nextReminder), "yyyy-MM-dd'T'HH:mm")
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onEdit(contact.id, {
      name: name.trim(),
      frequency,
      nextReminder: new Date(nextReminder).toISOString(),
      notes: notes.trim() || undefined,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>
              Update contact details and reminder settings
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contact name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as ReminderFrequency)}>
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(frequencyLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <RichTextEditor
                value={notes}
                onChange={setNotes}
                placeholder="Add notes about this contact..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nextReminder">Next Reminder</Label>
              <Input
                id="nextReminder"
                type="datetime-local"
                value={nextReminder}
                onChange={(e) => setNextReminder(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
