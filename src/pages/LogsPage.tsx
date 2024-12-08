import { Card } from '../components/ui/Card';

export const LogsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Logs</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track all activities within your CRM
        </p>
      </div>

      <Card>
        <p className="text-gray-600 dark:text-gray-300">Activity logs functionality coming soon...</p>
      </Card>
    </div>
  );
};