import { formatTimestamp } from '../../../lib/dateUtils';
import { ContactActions } from './ContactActions';
import { StatusButton } from './StatusButton';
import { LeadId } from './LeadId';
import { ViewProps } from './types';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const GridView = ({ lead, showStatusDropdown, onStatusClick, onContactAction }: ViewProps) => {
  const getLatestNote = () => {
    if (!lead.notes.length) return null;
    const note = lead.notes[lead.notes.length - 1];
    const div = document.createElement('div');
    div.innerHTML = note.content;
    return div.textContent || div.innerText || '';
  };

  return (
    <div className="h-[280px] flex flex-col p-4">
      <LeadId id={lead.id} />

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
            {lead.firstName} {lead.lastName}
          </h3>
          <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            <span>{formatTimestamp(lead.createdAt)}</span>
          </div>
        </div>
        <div className="relative">
          <StatusButton
            status={lead.status}
            onClick={onStatusClick}
            showDropdown={showStatusDropdown}
          />
        </div>
      </div>

      <div className="space-y-2 flex-grow">
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

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <ContactActions
            email={lead.email}
            phone={lead.phone}
            onAction={onContactAction}
          />
          {lead.notes.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 ml-4">
              Latest: {getLatestNote()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};