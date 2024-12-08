import { useState } from 'react';
import { Card } from '../ui/Card';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { LeadStatus } from '../../types/lead';
import { toast } from '../ui/Toast';

interface StatusManagerProps {
  statuses: LeadStatus[];
  onStatusChange: (statuses: LeadStatus[]) => void;
}

export const StatusManager = ({ statuses, onStatusChange }: StatusManagerProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<Partial<LeadStatus>>({});

  const handleStatusUpdate = (status: LeadStatus) => {
    const updatedStatuses = statuses.map(s => 
      s.id === status.id ? status : s
    );
    onStatusChange(updatedStatuses);
    setIsEditing(null);
    toast.success('Status updated successfully');
  };

  const handleStatusAdd = () => {
    if (!newStatus.name || !newStatus.color) {
      toast.error('Please fill in all required fields');
      return;
    }

    const status: LeadStatus = {
      id: `status_${Date.now()}`,
      name: newStatus.name,
      color: newStatus.color,
      order: statuses.length + 1,
      isDefault: newStatus.isDefault || false
    };

    if (status.isDefault) {
      // Update other statuses to not be default
      const updatedStatuses = statuses.map(s => ({
        ...s,
        isDefault: false
      }));
      onStatusChange([...updatedStatuses, status]);
    } else {
      onStatusChange([...statuses, status]);
    }

    setNewStatus({});
    toast.success('Status added successfully');
  };

  const handleStatusDelete = (statusId: string) => {
    const updatedStatuses = statuses.filter(s => s.id !== statusId);
    onStatusChange(updatedStatuses);
    toast.success('Status deleted successfully');
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Lead Statuses
          </h3>
          <button
            onClick={() => setIsEditing('new')}
            className="btn inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Status</span>
          </button>
        </div>

        <div className="space-y-4">
          {statuses.map((status) => (
            <div
              key={status.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {status.name}
                </span>
                {status.isDefault && (
                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(status.id)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleStatusDelete(status.id)}
                  className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
                  disabled={status.isDefault}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};