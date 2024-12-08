import { useState, useEffect } from 'react';
import { Lead } from '../../types/lead';
import { Card } from '../ui/Card';
import { Mail, Phone, MessageSquare, Clock, MapPin, Hash, ChevronDown } from 'lucide-react';
import { LeadModal } from './LeadModal';
import { toast } from '../ui/Toast';
import { cn } from '../../lib/utils';
import { DEFAULT_STATUSES } from '../../types/lead';
import { useLeadStore } from '../../lib/leadStore';
import { Portal } from '../ui/Portal';
import { getCurrentUser } from '../../lib/auth';

interface LeadCardProps {
  lead: Lead;
  view: 'grid' | 'list-compact' | 'list-full';
  onUpdate: (updatedLead: Lead) => void;
}

export const LeadCard = ({ lead, view, onUpdate }: LeadCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const updateLead = useLeadStore((state) => state.updateLead);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.querySelector(`[data-dropdown-id="${lead.id}"]`);
      const button = document.querySelector(`[data-lead-id="${lead.id}"].status-button`);
      if (dropdown && button && !dropdown.contains(event.target as Node) && !button.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [lead.id]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${lead.phone}`;
    toast.success('Initiating call...');
  };

  const handleText = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `sms:${lead.phone}`;
    toast.success('Opening text message...');
  };

  const handleEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `mailto:${lead.email}`;
    toast.success('Opening email client...');
  };

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowStatusDropdown(!showStatusDropdown);
  };

  const handleStatusChange = (status: typeof DEFAULT_STATUSES[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const user = getCurrentUser();
    if (!user?.tenantId || lead.tenantId !== user.tenantId) {
      toast.error('You do not have permission to modify this lead');
      return;
    }
    updateLead(lead.id, { status });
    setShowStatusDropdown(false);
    toast.success(`Status updated to ${status.name}`);
  };

  const getLatestNote = () => {
    if (!lead.notes.length) return null;
    const note = lead.notes[lead.notes.length - 1];
    const div = document.createElement('div');
    div.innerHTML = note.content;
    return div.textContent || div.innerText || '';
  };
  const StatusButton = () => (
    <div className="relative inline-flex">
      <button
        data-lead-id={lead.id}
        className={cn(
          'status-button',
          'px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-2',
          'transition-colors duration-200 hover:opacity-80'
        )}
        onClick={handleStatusClick}
        style={{ 
          backgroundColor: `${lead.status.color}20`,
          color: lead.status.color
        }}
      >
        <span 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: lead.status.color }}
        />
        <span>{lead.status.name}</span>
        <ChevronDown className={cn(
          "w-3 h-3",
          showStatusDropdown && "transform rotate-180"
        )} />
      </button>
    </div>
  );

  const StatusDropdown = () => {
    if (!showStatusDropdown) return null;

    const button = document.querySelector(`[data-lead-id="${lead.id}"].status-button`);
    const rect = button?.getBoundingClientRect();

    if (!rect) return null;

    return (
      <Portal>
        <div 
          className="fixed w-screen h-screen top-0 left-0 bg-transparent pointer-events-none"
          style={{ zIndex: 99999 }}
        >
          <div 
            data-dropdown-id={lead.id}
            className="absolute mt-1 w-48 rounded-md shadow-lg pointer-events-auto"
            style={{
              top: `${rect.bottom + window.scrollY + 4}px`,
              left: `${rect.left + window.scrollX}px`,
              backgroundColor: 'var(--popover)',
              border: '1px solid var(--border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              {DEFAULT_STATUSES.map((status) => (
                <button
                  key={status.id}
                  onClick={(e) => handleStatusChange(status, e)}
                  className={cn(
                    'w-full px-4 py-2 text-sm text-left flex items-center space-x-2',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    'bg-white dark:bg-gray-800',
                    status.id === lead.status.id && 'bg-gray-50 dark:bg-gray-700'
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
        </div>
      </Portal>
    );
  };

  const ContactActions = () => (
    <div className="flex items-center space-x-2 flex-shrink-0">
      <button
        onClick={handleEmail}
        className="contact-action contact-action-email"
        title="Send email"
      >
        <Mail className="w-4 h-4" />
      </button>
      {lead.phone && (
        <>
          <button
            onClick={handleCall}
            className="contact-action contact-action-call"
            title="Call"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={handleText}
            className="contact-action contact-action-message"
            title="Send text"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
  if (view === 'list-compact') {
    return (
      <>
        <Card 
          className="cursor-pointer transition-all duration-300 hover:scale-[1.02] relative py-3 px-4"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8 flex-grow">
              <div className="w-64">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {lead.firstName} {lead.lastName}
                </h3>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTimestamp(lead.createdAt)}
                </div>
              </div>
              
              <div className="w-48 truncate text-sm text-gray-600 dark:text-gray-300">
                {lead.email}
              </div>
              
              {lead.phone && (
                <div className="w-32 truncate text-sm text-gray-600 dark:text-gray-300">
                  {lead.phone}
                </div>
              )}
              
              <div className="flex-grow text-sm text-gray-600 dark:text-gray-300 truncate">
                {lead.address.city}, {lead.address.state}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <StatusButton />
                <StatusDropdown />
              </div>
              <ContactActions />
            </div>
          </div>

          <div className="absolute top-2 right-2 text-xs text-gray-400">
            #{lead.id}
          </div>
        </Card>

        <LeadModal
          lead={lead}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={onUpdate}
        />
      </>
    );
  }

  if (view === 'list-full') {
    return (
      <>
        <Card 
          className="cursor-pointer transition-all duration-300 hover:scale-[1.02] relative p-4"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex justify-between">
            <div className="space-y-3 flex-grow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {lead.firstName} {lead.lastName}
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTimestamp(lead.createdAt)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Mail className="w-4 h-4 mr-2" />
                    {lead.email}
                  </div>
                  {lead.phone && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4 mr-2" />
                      {lead.phone}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 mr-2" />
                    {lead.address.street}
                  </div>
                  <div className="ml-6 text-sm text-gray-600 dark:text-gray-300">
                    {lead.address.city}, {lead.address.state} {lead.address.zipCode}
                  </div>
                </div>

                {lead.notes.length > 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p className="line-clamp-2">Latest: {getLatestNote()}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end space-y-4">
              <div className="relative">
                <StatusButton />
                <StatusDropdown />
              </div>
              <ContactActions />
            </div>
          </div>

          <div className="absolute top-2 right-2 text-xs text-gray-400">
            #{lead.id}
          </div>
        </Card>

        <LeadModal
          lead={lead}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={onUpdate}
        />
      </>
    );
  }
  // Grid view (default)
  return (
    <>
      <Card 
        className="cursor-pointer transition-all duration-300 hover:scale-[1.02] relative min-h-[320px] h-full"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="absolute top-2 right-2 flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
          <Hash className="w-3 h-3 mr-1" />
          <span>{lead.id}</span>
        </div>

        <div className="h-full flex flex-col p-4">
          {/* Header section */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {lead.firstName} {lead.lastName}
              </h3>
              <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                <span>
                  Created {formatTimestamp(lead.createdAt)}
                </span>
              </div>
            </div>
            <div className="relative">
              <StatusButton />
              <StatusDropdown />
            </div>
          </div>

          {/* Content section */}
          <div className="flex-1 flex flex-col mt-4">
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{lead.email}</span>
              </div>
              
              {lead.phone && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{lead.phone}</span>
                </div>
              )}
              
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {lead.address.street}, {lead.address.city}, {lead.address.state} {lead.address.zipCode}
                </span>
              </div>
            </div>

            {/* Notes section - if exists */}
            {lead.notes.length > 0 && (
              <div className="mt-auto mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  Latest: {getLatestNote()}
                </p>
              </div>
            )}

            {/* Footer section */}
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <ContactActions />
            </div>
          </div>
        </div>
      </Card>

      <LeadModal
        lead={lead}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={onUpdate}
      />
    </>
  );
};