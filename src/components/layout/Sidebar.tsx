import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Phone, 
  Mail, 
  BarChart2, 
  Settings,
  Pin,
  PinOff,
  Megaphone,
  ClipboardList
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  {
    to: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    color: 'rgb(59, 130, 246)',
  },
  {
    to: '/leads',
    icon: Users,
    label: 'Leads',
    color: 'rgb(34, 197, 94)',
  },
  {
    to: '/messaging',
    icon: MessageSquare,
    label: 'Messaging',
    color: 'rgb(168, 85, 247)',
  },
  {
    to: '/calls',
    icon: Phone,
    label: 'Calls',
    color: 'rgb(234, 179, 8)',
  },
  {
    to: '/email',
    icon: Mail,
    label: 'Email',
    color: 'rgb(239, 68, 68)',
  },
  {
    to: '/campaigns',
    icon: Megaphone,
    label: 'Campaigns',
    color: 'rgb(236, 72, 153)',
  },
  {
    to: '/reports',
    icon: BarChart2,
    label: 'Reports',
    color: 'rgb(99, 102, 241)',
  },
  {
    to: '/logs',
    icon: ClipboardList,
    label: 'Logs',
    color: 'rgb(20, 184, 166)',
  },
  {
    to: '/settings',
    icon: Settings,
    label: 'Settings',
    color: 'rgb(107, 114, 128)',
  },
];

interface NavItemProps {
  to: string;
  Icon: typeof LayoutDashboard;
  label: string;
  color: string;
  collapsed: boolean;
}

const NavItem = ({ to, Icon, label, color, collapsed }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      'flex items-center px-3 py-2 rounded-lg transition-all duration-200 relative group',
      'hover:bg-gray-100 dark:hover:bg-gray-800',
      isActive && 'bg-white/10 dark:bg-white/5',
      collapsed ? 'justify-center' : 'w-full'
    )}
    style={({ isActive }) => ({
      color: isActive ? color : undefined,
      backgroundColor: isActive ? `${color}10` : undefined,
    })}
  >
   <Icon 
  className={cn(
    'shrink-0', // Add this to prevent shrinking
    'transition-all duration-300',
    collapsed ? 'w-6 h-6' : 'w-5 h-5',
    'group-hover:scale-110'
  )}
  style={{ color }}
/>
    <span className={cn(
      'ml-3 transition-all duration-300 font-medium',
      collapsed && 'hidden'
    )}>
      {label}
    </span>
    {collapsed && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        {label}
      </div>
    )}
  </NavLink>
);

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [pinned, setPinned] = useState(true);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      `${collapsed ? '4rem' : '16rem'}`
    );
    return () => {
      document.documentElement.style.removeProperty('--sidebar-width');
    };
  }, [collapsed]);

  return (
    <div
      className={cn(
        'flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
        'transition-all duration-300 ease-in-out fixed z-20',
        collapsed ? 'w-16' : 'w-64',
        !pinned && !collapsed && 'shadow-xl'
      )}
      onMouseEnter={() => !pinned && setCollapsed(false)}
      onMouseLeave={() => !pinned && setCollapsed(true)}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className={cn(
          "font-bold text-xl text-primary transition-all duration-300",
          collapsed && "hidden"
        )}>
          Pulse365
        </h1>
        <div className="flex items-center">
          <button
            onClick={() => setPinned(!pinned)}
            className="p-1 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
          >
            {pinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            Icon={item.icon}
            label={item.label}
            color={item.color}
            collapsed={collapsed}
          />
        ))}
      </nav>
    </div>
  );
};