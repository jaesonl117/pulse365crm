import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLeadStore } from '../../../lib/leadStore';
import { startOfMonth, endOfMonth, eachMonthOfInterval, format } from 'date-fns';
import { DEFAULT_STATUSES } from '../../../types/lead';

const CONVERSION_STAGES = {
  NEW_TO_CONTACTED: {
    from: 'New',
    to: 'Contacted',
    color: '#EAB308',
    label: 'Contact Rate'
  },
  CONTACTED_TO_QUALIFIED: {
    from: 'Contacted',
    to: 'Qualified',
    color: '#A855F7',
    label: 'Qualification Rate'
  },
  QUALIFIED_TO_PROPOSAL: {
    from: 'Qualified',
    to: 'Proposal',
    color: '#6366F1',
    label: 'Proposal Rate'
  },
  PROPOSAL_TO_SOLD: {
    from: 'Proposal',
    to: 'Sold',
    color: '#22C55E',
    label: 'Close Rate'
  }
};

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
            {entry.name}: {entry.value}%
          </span>
        </div>
      ))}
    </div>
  );
};

export const LeadConversionChart = () => {
  const leads = useLeadStore((state) => state.leads);
  
  // Get last 6 months
  const today = new Date();
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  
  const months = eachMonthOfInterval({
    start: sixMonthsAgo,
    end: today
  });

  const data = months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthLeads = leads.filter(lead => {
      const leadDate = new Date(lead.createdAt);
      return leadDate >= monthStart && leadDate <= monthEnd;
    });

    const result: any = {
      month: format(month, 'MMM yyyy'),
    };

    // Calculate conversion rates for each stage
    Object.entries(CONVERSION_STAGES).forEach(([key, stage]) => {
      const fromCount = monthLeads.filter(lead => 
        lead.history.some(h => 
          h.action === 'status_changed' && 
          h.oldValue === stage.from
        )
      ).length;

      const toCount = monthLeads.filter(lead =>
        lead.history.some(h =>
          h.action === 'status_changed' &&
          h.oldValue === stage.from &&
          h.newValue === stage.to
        )
      ).length;

      result[key] = fromCount ? Math.round((toCount / fromCount) * 100) : 0;
    });

    return result;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {Object.entries(CONVERSION_STAGES).map(([key, stage]) => (
          <div 
            key={key}
            className="flex items-center space-x-2 text-sm"
            title={`Percentage of leads that moved from ${stage.from} to ${stage.to} status`}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: stage.color }}
            />
            <span>{stage.label}</span>
          </div>
        ))}
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {Object.entries(CONVERSION_STAGES).map(([key, stage]) => (
              <Bar
                key={key}
                dataKey={key}
                name={stage.label}
                fill={stage.color}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>* Conversion rates show the percentage of leads that successfully move through each stage of the sales pipeline.</p>
      </div>
    </div>
  );
};