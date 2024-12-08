import { cn } from '../../../lib/utils';
import { DEFAULT_STATUSES, LeadStatus } from '../../../types/lead';

interface StatusDropdownProps {
  show: boolean;
  currentStatus: LeadStatus;
  onStatusChange: (status: LeadStatus) => void;
}

export const StatusDropdown = ({ show, currentStatus, onStatusChange }: StatusDropdownProps) => {
  if (!show) return null;

  return (
    <div 
      className="fixed mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
      onClick={(e) => e.stopPropagation()}
      style={{
        top: 'var(--dropdown-top)',
        left: 'var(--dropdown-left)',
        zIndex: 99999
      }}
    >
      <div className="py-1">
        {DEFAULT_STATUSES.map((status) => (
          <button
            key={status.id}
            onClick={() => onStatusChange(status)}
            className={cn(
              'w-full px-4 py-2 text-sm text-left flex items-center space-x-2',
              'hover:bg-gray-100 dark:hover:bg-gray-700',
              status.id === currentStatus.id && 'bg-gray-50 dark:bg-gray-700'
            )}
            style={{ color: status.color }}
          >
            <span 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: status.color }}
            />
            <span>{status.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};