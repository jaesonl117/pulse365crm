import { DashboardWidget } from '../components/dashboard/DashboardWidget';
import { DashboardWidgetManager, WidgetDefinition } from '../components/dashboard/DashboardWidgetManager';
import { LeadsByStatusChart } from '../components/dashboard/widgets/LeadsByStatusChart';
import { LeadTrendChart } from '../components/dashboard/widgets/LeadTrendChart';
import { LeadConversionChart } from '../components/dashboard/widgets/LeadConversionChart';
import { LeadSourceChart } from '../components/dashboard/widgets/LeadSourceChart';
import { LeadActivityTimeline } from '../components/dashboard/widgets/LeadActivityTimeline';
import { LeadMetricsGrid } from '../components/dashboard/widgets/LeadMetricsGrid';
import { PieChart, LineChart, BarChart2, Activity, Users } from 'lucide-react';
import { useDashboardStore } from '../stores/dashboardStore';

const AVAILABLE_WIDGETS: WidgetDefinition[] = [
  {
    id: 'metrics',
    title: 'Key Metrics',
    component: LeadMetricsGrid,
    icon: Users,
    description: 'Overview of important lead metrics and KPIs'
  },
  {
    id: 'status',
    title: 'Leads by Status',
    component: LeadsByStatusChart,
    icon: PieChart,
    description: 'Current distribution of leads across different statuses'
  },
  {
    id: 'trend',
    title: 'Lead Trend',
    component: LeadTrendChart,
    icon: LineChart,
    description: 'Daily lead acquisition and status changes over time'
  },
  {
    id: 'conversion',
    title: 'Lead Conversion',
    component: LeadConversionChart,
    icon: BarChart2,
    description: 'Pipeline conversion rates between lead stages'
  },
  {
    id: 'source',
    title: 'Lead Sources',
    component: LeadSourceChart,
    icon: PieChart,
    description: 'Distribution of leads by acquisition source'
  },
  {
    id: 'activity',
    title: 'Recent Activity',
    component: LeadActivityTimeline,
    icon: Activity,
    description: 'Timeline of recent lead interactions and updates'
  }
];

export const DashboardPage = () => {
  const { activeWidgets, toggleWidget } = useDashboardStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Overview of your CRM activities and metrics
          </p>
        </div>

        <DashboardWidgetManager
          availableWidgets={AVAILABLE_WIDGETS}
          activeWidgets={activeWidgets}
          onWidgetToggle={toggleWidget}
        />
      </div>

      <div className="grid gap-6">
        {/* Metrics Grid - Always shown first if active */}
        {activeWidgets.includes('metrics') && (
          <DashboardWidget 
            title="Overview"
            icon={<Users className="w-4 h-4" />}
            onRemove={() => toggleWidget('metrics')}
          >
            <LeadMetricsGrid />
          </DashboardWidget>
        )}

        {/* Dynamic Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeWidgets
            .filter(id => id !== 'metrics')
            .map(widgetId => {
              const widget = AVAILABLE_WIDGETS.find(w => w.id === widgetId);
              if (!widget) return null;

              const Component = widget.component;
              const Icon = widget.icon;

              return (
                <DashboardWidget
                  key={widget.id}
                  title={widget.title}
                  icon={Icon && <Icon className="w-4 h-4" />}
                  onRemove={() => toggleWidget(widget.id)}
                >
                  <Component />
                </DashboardWidget>
              );
            })}
        </div>
      </div>
    </div>
  );
};