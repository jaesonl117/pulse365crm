import { useState } from 'react';
import { Card } from '../ui/Card';
import { Settings, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DashboardWidgetProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  onEdit?: () => void;
  onRemove?: () => void;
}

export const DashboardWidget = ({
  title,
  icon,
  className,
  children,
  onEdit,
  onRemove
}: DashboardWidgetProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        'hover:shadow-lg',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {icon && <span className="text-gray-500 dark:text-gray-400">{icon}</span>}
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        
        {/* Actions */}
        <div 
          className={cn(
            'flex items-center space-x-2 transition-opacity duration-200',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Widget Content */}
      <div className="p-4">
        {children}
      </div>
    </Card>
  );
};