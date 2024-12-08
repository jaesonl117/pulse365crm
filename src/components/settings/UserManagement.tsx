import { useState } from 'react';
import { Card } from '../ui/Card';
import { useAuthStore } from '../../stores/authStore';
import { UserRole, ROLE_PERMISSIONS } from '../../types/auth';
import { usePermissions } from '../../hooks/usePermissions';
import { Plus, Edit2, Trash2, UserPlus } from 'lucide-react';
import { toast } from '../ui/Toast';
import { Dialog } from '../ui/Dialog';
import { mockDb } from '../../lib/mockDb';

export const UserManagement = () => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [users, setUsers] = useState(() => mockDb.getUsersByTenant());
  const { hasPermission } = usePermissions();
  const currentUser = useAuthStore(state => state.user);

  if (!hasPermission('manage_users')) {
    return null;
  }

  const handleAddUser = async (userData: any) => {
    try {
      const newUser = await mockDb.createUser({
        ...userData,
        tenantId: currentUser?.tenantId,
        status: 'active'
      });
      
      setUsers(prev => [...prev, newUser]);
      toast.success('User added successfully');
      setShowAddUser(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add user');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            User Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage users and their access levels
          </p>
        </div>
        
        <button
          onClick={() => setShowAddUser(true)}
          className="btn inline-flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      <div className="space-y-4">
        {users.map(user => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div>
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full" style={{
                  backgroundColor: `${getRoleColor(user.role)}20`,
                  color: getRoleColor(user.role)
                }}>
                  {ROLE_PERMISSIONS[user.role].name}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {ROLE_PERMISSIONS[user.role].description}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {/* Implement edit */}}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {/* Implement delete */}}
                className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
                disabled={user.id === currentUser?.id}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddUserDialog
        isOpen={showAddUser}
        onClose={() => setShowAddUser(false)}
        onSubmit={handleAddUser}
      />
    </Card>
  );
};

function getRoleColor(role: UserRole): string {
  switch (role) {
    case UserRole.TENANT_ADMIN:
      return '#3B82F6'; // blue
    case UserRole.MANAGER:
      return '#8B5CF6'; // purple
    case UserRole.USER:
      return '#10B981'; // green
    default:
      return '#6B7280'; // gray
  }
}

function AddUserDialog({ isOpen, onClose, onSubmit }: any) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: UserRole.USER
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add New User"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className="form-control mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              className="form-control mt-1"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="form-control mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="form-control mt-1"
            required
            minLength={8}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Role
          </label>
          <select
            value={formData.role}
            onChange={e => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
            className="form-control mt-1"
          >
            {Object.entries(ROLE_PERMISSIONS).map(([role, { name, description }]) => (
              <option key={role} value={role}>
                {name} - {description}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn"
          >
            Add User
          </button>
        </div>
      </form>
    </Dialog>
  );
}