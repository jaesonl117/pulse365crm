import { Lead } from '../../../types/lead';

export interface ViewProps {
  lead: Lead;
  showStatusDropdown: boolean;
  onStatusClick: (e: React.MouseEvent) => void;
  onStatusChange: (status: Lead['status']) => void;
  onContactAction: (type: 'call' | 'text' | 'email') => (e: React.MouseEvent) => void;
}