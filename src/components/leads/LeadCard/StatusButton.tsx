import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { LeadStatus } from '../../../types/lead';

interface StatusButtonProps {
  status: LeadStatus;
  onClick: (e: React.MouseEvent) => void;
  showDropdown: boolean;
}

export const StatusButton = ({ status, onClick, showDropdown }: StatusButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      document.documentElement.style.setProperty('--dropdown-top', `${rect.bottom + window.scrollY + 4}px`);
      document.documentElement.style.setProperty('--dropdown-left', `${rect.left + window.scrollX}px`);
    }
  }, [showDropdown]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={cn(
        'px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-2',
        'transition-colors duration-200 hover:opacity-80'
      )}
      style={{ 
        backgroundColor: `${status.color}20`,
        color: status.color
      }}
    >
      <span 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: status.color }}
      />
      <span>{status.name}</span>
      <ChevronDown className={cn(
        'w-3 h-3 transition-transform duration-200',
        showDropdown && 'transform rotate-180'
      )} />
    </button>
  );
};