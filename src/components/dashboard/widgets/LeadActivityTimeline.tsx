import { useLeadStore } from '../../../lib/leadStore';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from 'lucide-react';
import { generateId } from '../../../lib/idGenerator';

export const LeadActivityTimeline = () => {
  const leads = useLeadStore((state) => state.leads);
  
  // Get all history entries from all leads with unique IDs
  const activities = leads.flatMap(lead => 
    lead.history.map(history => ({
      ...history,
      uniqueId: generateId('activity_'),
      leadName: `${lead.firstName} ${lead.lastName}`
    }))
  ).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 10);

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div 
          key={activity.uniqueId}
          className="flex items-start space-x-3 text-sm"
        >
          <div className="flex-shrink-0 mt-1">
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <p className="font-medium text-gray-900 dark:text-white">
                {activity.leadName}
              </p>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {activity.action === 'created' && 'Lead created'}
              {activity.action === 'updated' && `Updated ${activity.field} from "${activity.oldValue}" to "${activity.newValue}"`}
              {activity.action === 'status_changed' && `Changed status from "${activity.oldValue}" to "${activity.newValue}"`}
              {activity.action === 'note_added' && 'Added a new note'}
            </p>
            <p className="text-xs text-gray-500">
              by {activity.performedBy.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};