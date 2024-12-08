import { Hash } from 'lucide-react';

interface LeadIdProps {
  id: string;
}

export const LeadId = ({ id }: LeadIdProps) => (
  <div className="absolute top-2 right-2 flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
    <Hash className="w-3 h-3 mr-1" />
    <span>{id}</span>
  </div>
);