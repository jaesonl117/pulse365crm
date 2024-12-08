import { Mail, Phone, MessageSquare } from 'lucide-react';

interface ContactActionsProps {
  email: string;
  phone?: string;
  onAction: (type: 'call' | 'text' | 'email') => (e: React.MouseEvent) => void;
}

export const ContactActions = ({ email, phone, onAction }: ContactActionsProps) => (
  <div className="flex items-center space-x-2 flex-shrink-0">
    <button
      onClick={onAction('email')}
      className="contact-action contact-action-email"
      title="Send email"
    >
      <Mail className="w-4 h-4" />
    </button>
    {phone && (
      <>
        <button
          onClick={onAction('call')}
          className="contact-action contact-action-call"
          title="Call"
        >
          <Phone className="w-4 h-4" />
        </button>
        <button
          onClick={onAction('text')}
          className="contact-action contact-action-message"
          title="Send text"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
      </>
    )}
  </div>
);