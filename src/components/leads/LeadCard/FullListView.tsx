import { formatTimestamp } from '../../../lib/dateUtils';
import { ContactActions } from './ContactActions';
import { StatusButton } from './StatusButton';
import { LeadId } from './LeadId';
import { ViewProps } from './types';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const FullListView = ({ lead, showStatusDropdown, onStatusClick, onContactAction }: ViewProps) => {
  const getLatestNote = () => {
    if (!lead.notes.length) return null;
    const note = lead.notes[lead.notes.length - 1];
    const div = document.createElement('div');
    div.innerHTML = note.content;
    return div.textContent || div.innerText || '';
  };

  return (
    <div className="p-4">
      <LeadId id={lead.id} />

      <div className="flex justify-between">
        <div className="space-y-3 flex-grow min-w-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {lead.firstName} {lead.lastName}
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {formatTimestamp(lead.createdAt)}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1 min-w-0">
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
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{lead.address.street}</span>
              </div>
              <div className="ml-6 text-sm text-gray-600 dark:text-gray-300 truncate">
                {lead.address.city}, {lead.address.state} {lead.address.zipCode}
              </div>
            </div>

            {lead.notes.length > 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400 min-w-0">
                <p className="line-clamp-2">Latest: {getLatestNote()}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end space-y-4 ml-4 flex-shrink-0">
          <StatusButton
            status={lead.status}
            onClick={onStatusClick}
            showDropdown={showStatusDropdown}
          />
          <ContactActions
            email={lead.email}
            phone={lead.phone}
            onAction={onContactAction}
          />
        </div>
      </div>
    </div>
  );
};