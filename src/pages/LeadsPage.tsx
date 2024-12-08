import { useState } from 'react';
import { LeadCard } from '../components/leads/LeadCard';
import { AddLeadModal } from '../components/leads/AddLeadModal';
import { Grid, List, LayoutList, Search, Plus, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLeadStore } from '../lib/leadStore';

type ViewMode = 'grid' | 'list-compact' | 'list-full';

export const LeadsPage = () => {
  const [view, setView] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const leads = useLeadStore((state) => state.leads);

  return (
    <div className="space-y-6 max-w-[2000px] mx-auto px-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and track your leads
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="btn inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control pl-10 w-full"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Filter Button */}
          <button className="btn btn-secondary inline-flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setView('grid')}
            className={cn(
              'p-2 rounded-md transition-colors',
              view === 'grid'
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            )}
            title="Grid view"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView('list-compact')}
            className={cn(
              'p-2 rounded-md transition-colors',
              view === 'list-compact'
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            )}
            title="Compact list"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView('list-full')}
            className={cn(
              'p-2 rounded-md transition-colors',
              view === 'list-full'
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            )}
            title="Full list"
          >
            <LayoutList className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Leads Grid/List */}
      <div className={cn(
        'grid gap-4',
        view === 'grid' && 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
        'w-full'
      )}>
        {leads.map((lead) => (
          <LeadCard 
            key={lead.id} 
            lead={lead} 
            view={view}
            onUpdate={(updatedLead) => {
              useLeadStore.getState().updateLead(lead.id, updatedLead);
            }}
          />
        ))}
      </div>

      <AddLeadModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};