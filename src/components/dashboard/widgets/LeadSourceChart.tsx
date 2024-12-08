import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useLeadStore } from '../../../lib/leadStore';

const SOURCES = [
  { name: 'Website', color: '#3B82F6' },
  { name: 'Referral', color: '#10B981' },
  { name: 'Social Media', color: '#6366F1' },
  { name: 'Email Campaign', color: '#F59E0B' },
  { name: 'Direct', color: '#EC4899' }
];

export const LeadSourceChart = () => {
  const leads = useLeadStore((state) => state.leads);
  
  // Simulate source distribution for demo
  const data = SOURCES.map(source => ({
    name: source.name,
    value: Math.floor(Math.random() * leads.length),
    color: source.color
  }));

  return (
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
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};