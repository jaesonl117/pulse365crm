import { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Lead, DEFAULT_STATUSES } from '../../types/lead';
import { toast } from '../ui/Toast';
import { Mail, Phone, MessageSquare, Plus } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RichTextEditor } from '../editor/RichTextEditor';
import { CustomFieldForm } from '../ui/CustomFieldForm';
import { useCustomFieldsStore } from '../../stores/customFieldsStore';
import { useLeadStore } from '../../lib/leadStore';
import { getCurrentUser } from '../../lib/auth';

const leadSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().min(5, 'ZIP code is required'),
  }),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (updatedLead: Lead) => void;
}

export const LeadModal = ({ lead, isOpen, onClose, onUpdate }: LeadModalProps) => {
  const [newNote, setNewNote] = useState('');
  const [showCustomFieldForm, setShowCustomFieldForm] = useState(false);
  const { user } = useAuthStore();
  const customFields = useCustomFieldsStore((state) => state.fields);
  const addCustomField = useCustomFieldsStore((state) => state.addField);
  const updateLead = useLeadStore((state) => state.updateLead);
  const addNote = useLeadStore((state) => state.addNote);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      address: lead.address,
    },
  });

  const handleStatusChange = (statusName: string) => {
    const newStatus = DEFAULT_STATUSES.find(s => s.name === statusName);
    if (newStatus) {
      updateLead(lead.id, { status: newStatus });
      if (onUpdate) {
        onUpdate({ ...lead, status: newStatus });
      }
      toast.success(`Status updated to ${newStatus.name}`);
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${lead.phone}`;
    toast.success('Initiating call...');
  };

  const handleText = () => {
    window.location.href = `sms:${lead.phone}`;
    toast.success('Opening text message...');
  };

  const handleEmail = () => {
    window.location.href = `mailto:${lead.email}`;
    toast.success('Opening email client...');
  };

  const handleSave = (formData: LeadFormData) => {
    const user = getCurrentUser();
    if (!user?.tenantId || lead.tenantId !== user.tenantId) {
      toast.error('You do not have permission to modify this lead');
      return;
    }
    updateLead(lead.id, formData);
    if (onUpdate) {
      onUpdate({ ...lead, ...formData });
    }
    toast.success('Lead updated successfully');
    onClose();
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNote(lead.id, newNote);
    setNewNote('');
    toast.success('Note added successfully');
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`${lead.firstName} ${lead.lastName}`}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Lead ID: {lead.id}</p>
            <div className="mt-1 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
                <select
                  value={lead.status.name}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="form-control"
                  style={{ color: lead.status.color }}
                >
                  {DEFAULT_STATUSES.map((s) => (
                    <option
                      key={s.id}
                      value={s.name}
                      style={{ color: s.color }}
                    >
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCustomFieldForm(true)}
            className="btn inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Field</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              {...register('firstName')}
              className="form-control mt-1"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              {...register('lastName')}
              className="form-control mt-1"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="mt-1 flex items-center">
              <input
                {...register('email')}
                className="form-control"
              />
              <button
                type="button"
                onClick={handleEmail}
                className="contact-action contact-action-email ml-2"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone
            </label>
            <div className="mt-1 flex items-center">
              <input
                {...register('phone')}
                className="form-control"
              />
              <div className="flex items-center space-x-2 ml-2">
                <button
                  type="button"
                  onClick={handleCall}
                  className="contact-action contact-action-call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleText}
                  className="contact-action contact-action-message"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Street Address
              </label>
              <input
                {...register('address.street')}
                className="form-control mt-1"
              />
              {errors.address?.street && (
                <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                City
              </label>
              <input
                {...register('address.city')}
                className="form-control mt-1"
              />
              {errors.address?.city && (
                <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                State
              </label>
              <input
                {...register('address.state')}
                className="form-control mt-1"
              />
              {errors.address?.state && (
                <p className="mt-1 text-sm text-red-600">{errors.address.state.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                ZIP Code
              </label>
              <input
                {...register('address.zipCode')}
                className="form-control mt-1"
              />
              {errors.address?.zipCode && (
                <p className="mt-1 text-sm text-red-600">{errors.address.zipCode.message}</p>
              )}
            </div>
          </div>
        </div>

        {customFields.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Custom Fields</h3>
            <div className="grid grid-cols-2 gap-4">
              {customFields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.name}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <select className="form-control mt-1">
                      <option value="">Select an option</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className="form-control mt-1"
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notes</h3>
          <div className="space-y-4">
            <RichTextEditor
              content={newNote}
              onChange={setNewNote}
              placeholder="Add a note..."
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddNote}
                className="btn"
              >
                Add Note
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {lead.notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>{note.createdBy.name}</span>
                    <span>{new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                  <div 
                    className="prose dark:prose-invert max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn"
          >
            Save Changes
          </button>
        </div>
      </form>

      <CustomFieldForm
        isOpen={showCustomFieldForm}
        onClose={() => setShowCustomFieldForm(false)}
        onSave={addCustomField}
      />
    </Dialog>
  );
};