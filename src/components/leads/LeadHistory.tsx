import { formatDistanceToNow } from 'date-fns';
import { LeadHistory as LeadHistoryType } from '../../types/lead';

interface LeadHistoryProps {
  history: LeadHistoryType[];
}

export const LeadHistory = ({ history }: LeadHistoryProps) => {
  return (
    <div className="space-y-4">
      {history.map((entry) => (
        <div
          key={entry.id}
          className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
        >
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{entry.performedBy.name}</span>
            <span>{formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}</span>
          </div>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {entry.action === 'created' && 'Lead created'}
            {entry.action === 'updated' && `Updated ${entry.field} from "${entry.oldValue}" to "${entry.newValue}"`}
            {entry.action === 'status_changed' && `Changed status from "${entry.oldValue}" to "${entry.newValue}"`}
            {entry.action === 'note_added' && 'Added a new note'}
          </p>
        </div>
      ))}
    </div>
  );
};