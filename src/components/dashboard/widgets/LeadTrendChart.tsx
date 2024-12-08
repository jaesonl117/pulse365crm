import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLeadStore } from '../../../lib/leadStore';
import { subDays, format, startOfDay, endOfDay } from 'date-fns';
import { DEFAULT_STATUSES } from '../../../types/lead';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="font-medium mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {entry.name}: {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const LeadTrendChart = () => {
  const leads = useLeadStore((state) => state.leads);
  
  // Generate data for the last 30 days
  const data = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    const dateStr = format(date, 'MM/dd');

    const dayLeads = leads.filter(lead => {
      const leadDate = new Date(lead.createdAt);
      return leadDate >= dayStart && leadDate <= dayEnd;
    });

    // Count leads by status
    const statusCounts = DEFAULT_STATUSES.reduce((acc, status) => {
      acc[status.name] = dayLeads.filter(lead => 
        lead.status.name === status.name
      ).length;
      return acc;
    }, {} as Record<string, number>);

    return {
      date: dateStr,
      total: dayLeads.length,
      ...statusCounts
    };
  });

  // Get active statuses (ones that have leads)
  const activeStatuses = DEFAULT_STATUSES.filter(status =>
    data.some(day => day[status.name] > 0)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {activeStatuses.map(status => (
          <div 
            key={status.id}
            className="flex items-center space-x-2 text-sm"
            title={`Number of leads in ${status.name} status`}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: status.color }}
            />
            <span>{status.name}</span>
          </div>
        ))}
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {activeStatuses.map(status => (
              <Area
                key={status.id}
                type="monotone"
                dataKey={status.name}
                name={status.name}
                stroke={status.color}
                fill={status.color}
                fillOpacity={0.1}
                stackId="1"
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>* The chart shows the daily distribution of leads across different statuses.</p>
        <p>* Areas are stacked to show the total number of leads and their status breakdown.</p>
      </div>
    </div>
  );
};