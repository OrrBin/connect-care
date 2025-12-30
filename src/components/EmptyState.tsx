import { forwardRef } from 'react';
import { Users } from 'lucide-react';

export const EmptyState = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center mb-6">
        <Users className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">No contacts yet</h2>
      <p className="text-muted-foreground text-center max-w-sm">
        Add people you want to stay in touch with, and we'll remind you at random intervals to reach out.
      </p>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';
