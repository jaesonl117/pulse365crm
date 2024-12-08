import { formatTimestamp } from '../../../lib/dateUtils';
import { ContactActions } from './ContactActions';
import { StatusButton } from './StatusButton';
import { ViewProps } from './types';
import { Clock } from 'lucide-react';

export const CompactListView = ({ lead, showStatusDropdown, onStatusClick, onContactAction }: ViewProps) => {
  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="flex items-center space-x-8 min-w-0 flex-grow">
        <div className="flex items-center space-x-2 w-8">
          <span className="text-xs text-gray-400">#{lead.id}</span>
        </div>
        
        <div className="w-48 flex-shrink-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {lead.firstName} {lead.lastName}
          </h3>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {formatTimestamp(lead.createdAt)}
          </div>
        </div>
        
        <div className="w-48 flex-shrink-0 truncate text-sm text-gray-600 dark:text-gray-300">
          {lead.email}
        </div>
        
        {lead.phone && (
          <div className="w-32 flex-shrink-0 truncate text-sm text-gray-600 dark:text-gray-300">
            {lead.phone}
          </div>
        )}
        
        <div className="flex-shrink text-sm text-gray-600 dark:text-gray-300 truncate">
          {lead.address.city}, {lead.address.state}
        </div>
      </div>

      <div className="flex items-center space-x-4 flex-shrink-0">
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
  );
};