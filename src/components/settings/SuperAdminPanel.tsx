import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { mockDb } from '../../lib/mockDb';
import { clearAllStorage } from '../../lib/clearStorage';
import { toast } from '../ui/Toast';
import { Building2, Users, Trash2 } from 'lucide-react';

export const SuperAdminPanel = () => {
  const [tenants, setTenants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Load all tenants and users
    const state = mockDb.getState();
    setTenants(state.tenants);
    setUsers(state.users);
  }, []);

  const handleClearStorage = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearAllStorage();
      toast.success('All data cleared successfully');
      // Reload the page to reset the application state
      window.location.reload();
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Super Admin Panel
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage all tenants and system data
          </p>
        </div>
        
        <button
          onClick={handleClearStorage}
          className="btn bg-red-500 hover:bg-red-600 text-white inline-flex items-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All Data</span>
        </button>
      </div>

      <div className="grid gap-6">
        {/* Tenants List */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Registered Companies
          </h3>
          <div className="space-y-4">
            {tenants.map(tenant => (
              <div
                key={tenant.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {tenant.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Industry: {tenant.industry}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Created: {new Date(tenant.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    tenant.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {tenant.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users List */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            All Users
          </h3>
          <div className="space-y-4">
            {users.map(user => (
              <div
                key={user.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Role: {user.role}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};