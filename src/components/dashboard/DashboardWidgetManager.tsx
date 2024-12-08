import { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Plus, X, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Tooltip } from '../ui/Tooltip';

export interface WidgetDefinition {
  id: string;
  title: string;
  component: React.ComponentType;
  icon?: React.ComponentType;
  description: string;
}

interface DashboardWidgetManagerProps {
  availableWidgets: WidgetDefinition[];
  activeWidgets: string[];
  onWidgetToggle: (widgetId: string) => void;
}

export const DashboardWidgetManager = ({
  availableWidgets,
  activeWidgets,
  onWidgetToggle
}: DashboardWidgetManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn inline-flex items-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>Manage Widgets</span>
      </button>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Manage Dashboard Widgets"
        description="Add or remove widgets to customize your dashboard view. Changes are automatically saved."
      >
        <div className="grid gap-4 py-4">
          {availableWidgets.map((widget) => {
            const isActive = activeWidgets.includes(widget.id);
            const Icon = widget.icon;

            return (
              <div
                key={widget.id}
                className={cn(
                  'p-4 rounded-lg border transition-all duration-200',
                  'hover:shadow-md cursor-pointer relative',
                  isActive ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                )}
                onClick={() => onWidgetToggle(widget.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {Icon && <Icon className="w-5 h-5 text-gray-500" />}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {widget.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {widget.description}
                      </p>
                    </div>
                  </div>
                  <Tooltip content={isActive ? 'Remove widget' : 'Add widget'}>
                    <button
                      className={cn(
                        'p-1 rounded-full transition-colors',
                        isActive ? 'text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/40' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      )}
                    >
                      {isActive ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
      </Dialog>
    </>
  );
};