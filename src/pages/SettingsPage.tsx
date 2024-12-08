import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { StatusManager } from '../components/settings/StatusManager';
import { UserManagement } from '../components/settings/UserManagement';
import { DEFAULT_STATUSES, LeadStatus } from '../types/lead';
import { usePermissions } from '../hooks/usePermissions';

export const SettingsPage = () => {
  const [statuses, setStatuses] = useState<LeadStatus[]>(DEFAULT_STATUSES);
  const { hasPermission } = usePermissions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure your CRM preferences
        </p>
      </div>

      <div className="grid gap-6">
        {/* Only show user management to admins */}
        {hasPermission('manage_users') && <UserManagement />}

        {/* Status management */}
        <StatusManager 
          statuses={statuses}
          onStatusChange={setStatuses}
        />

        {/* Other settings sections */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Other Settings
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Additional settings coming soon...
          </p>
        </Card>
      </div>
    </div>
  );
};