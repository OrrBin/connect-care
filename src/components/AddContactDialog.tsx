import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReminderFrequency, frequencyLabels } from '@/types/contact';
import { Plus } from 'lucide-react';

interface AddContactDialogProps {
  onAdd: (name: string, frequency: ReminderFrequency, notes?: string) => void;
}

export function AddContactDialog({ onAdd }: AddContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<ReminderFrequency>('monthly');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onAdd(name.trim(), frequency, notes.trim() || undefined);
    setName('');
    setFrequency('monthly');
    setNotes('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a new contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">How often?</Label>
            <Select value={frequency} onValueChange={(v) => setFrequency(v as ReminderFrequency)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(frequencyLabels) as [ReminderFrequency, string][]).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <RichTextEditor
              value={notes}
              onChange={setNotes}
              placeholder="Topics to discuss, shared interests..."
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Add Contact
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
