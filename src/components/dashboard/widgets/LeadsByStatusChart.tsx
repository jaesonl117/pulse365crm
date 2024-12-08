import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useLeadStore } from '../../../lib/leadStore';
import { DEFAULT_STATUSES } from '../../../types/lead';

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const percentage = ((data.value / data.total) * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="font-medium" style={{ color: data.color }}>{data.name}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {data.value} leads ({percentage}%)
      </p>
    </div>
  );
};

export const LeadsByStatusChart = () => {
  const leads = useLeadStore((state) => state.leads);
  
  const total = leads.length;
  const data = DEFAULT_STATUSES.map(status => ({
    id: status.id,
    name: status.name,
    value: leads.filter(lead => lead.status.id === status.id).length,
    color: status.color,
    total
  })).filter(item => item.value > 0);

  return (
    <div className="space-y-4">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name} (${value})`}
            >
              {data.map((entry) => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value, entry: any) => (
                <span style={{ color: entry.color }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>* Shows the current distribution of leads across different statuses.</p>
        <p>* Hover over segments to see detailed counts and percentages.</p>
      </div>
    </div>
  );
};