import { Card } from '../components/ui/Card';

export const CallsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calls</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Make and manage calls to leads
        </p>
      </div>

      <Card>
        <p className="text-gray-600 dark:text-gray-300">Call functionality coming soon...</p>
      </Card>
    </div>
  );
};