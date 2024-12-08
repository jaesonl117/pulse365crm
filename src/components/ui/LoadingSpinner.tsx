import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10"></div>
      </div>
    </div>
  );
};