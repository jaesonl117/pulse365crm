import { useState } from 'react';
import { Lead } from '../../../types/lead';
import { Card } from '../../ui/Card';
import { LeadModal } from '../LeadModal';
import { GridView } from './GridView';
import { CompactListView } from './CompactListView';
import { FullListView } from './FullListView';
import { StatusDropdown } from './StatusDropdown';
import { useLeadStore } from '../../../lib/leadStore';
import { toast } from '../../ui/Toast';

interface LeadCardProps {
  lead: Lead;
  view: 'grid' | 'list-compact' | 'list-full';
  onUpdate: (updatedLead: Lead) => void;
}

export const LeadCard = ({ lead, view, onUpdate }: LeadCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const updateLead = useLeadStore((state) => state.updateLead);

  const handleStatusChange = (status: Lead['status']) => {
    updateLead(lead.id, { status });
    setShowStatusDropdown(false);
    toast.success(`Status updated to ${status.name}`);
  };

  const handleContactAction = (type: 'call' | 'text' | 'email') => {
    const actions = {
      call: () => {
        window.location.href = `tel:${lead.phone}`;
        toast.success('Initiating call...');
      },
      text: () => {
        window.location.href = `sms:${lead.phone}`;
        toast.success('Opening text message...');
      },
      email: () => {
        window.location.href = `mailto:${lead.email}`;
        toast.success('Opening email client...');
      },
    };
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      actions[type]();
    };
  };

  const sharedProps = {
    lead,
    showStatusDropdown,
    onStatusClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowStatusDropdown(!showStatusDropdown);
    },
    onStatusChange: handleStatusChange,
    onContactAction: handleContactAction,
  };

  const ViewComponent = {
    grid: GridView,
    'list-compact': CompactListView,
    'list-full': FullListView,
  }[view];

  return (
    <>
      <Card 
        className="cursor-pointer transition-all duration-300 hover:scale-[1.02] relative"
        onClick={() => setIsModalOpen(true)}
      >
        <ViewComponent {...sharedProps} />
        <StatusDropdown
          show={showStatusDropdown}
          currentStatus={lead.status}
          onStatusChange={handleStatusChange}
        />
      </Card>

      <LeadModal
        lead={lead}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={onUpdate}
      />
    </>
  );
};