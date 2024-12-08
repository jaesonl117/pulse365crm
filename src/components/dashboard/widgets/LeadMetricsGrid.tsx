import { Users, Phone, Mail, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';
import { useLeadStore } from '../../../lib/leadStore';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard = ({ title, value, change, icon, color }: MetricCardProps) => (
  <div 
    className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
    style={{ borderLeft: `4px solid ${color}` }}
  >
    <div 
      className="absolute top-2 right-2 opacity-20 transform transition-transform duration-300 group-hover:scale-110 group-hover:opacity-30"
      style={{ color }}
    >
      {icon}
    </div>
    <div className="relative">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold" style={{ color }}>{value}</p>
        {change !== undefined && (
          <p className={`ml-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </p>
        )}
      </div>
    </div>
  </div>
);

export const LeadMetricsGrid = () => {
  const leads = useLeadStore((state) => state.leads);
  
  const metrics = [
    {
      title: 'Total Leads',
      value: leads.length,
      change: 12,
      icon: <Users className="w-8 h-8" />,
      color: 'rgb(59, 130, 246)', // blue-500
    },
    {
      title: 'Calls Made',
      value: '456',
      change: -5,
      icon: <Phone className="w-8 h-8" />,
      color: 'rgb(234, 179, 8)', // yellow-500
    },
    {
      title: 'Emails Sent',
      value: '789',
      change: 8,
      icon: <Mail className="w-8 h-8" />,
      color: 'rgb(239, 68, 68)', // red-500
    },
    {
      title: 'Messages Sent',
      value: '321',
      change: 15,
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'rgb(168, 85, 247)', // purple-500
    },
    {
      title: 'Conversion Rate',
      value: '8.5%',
      change: 3,
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'rgb(34, 197, 94)', // green-500
    },
    {
      title: 'Tasks Due',
      value: '12',
      icon: <AlertCircle className="w-8 h-8" />,
      color: 'rgb(249, 115, 22)', // orange-500
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
};