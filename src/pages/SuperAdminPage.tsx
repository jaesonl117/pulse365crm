import { SuperAdminPanel } from '../components/settings/SuperAdminPanel';

export const SuperAdminPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Administration</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage all tenants and system data
        </p>
      </div>

      <SuperAdminPanel />
    </div>
  );
};