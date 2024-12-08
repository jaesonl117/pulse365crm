import { useState } from 'react';
import { Dialog } from './Dialog';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const fieldSchema = z.object({
  name: z.string().min(2, 'Field name must be at least 2 characters'),
  type: z.enum(['text', 'number', 'date', 'select']),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

type FieldFormData = z.infer<typeof fieldSchema>;

interface CustomFieldFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: FieldFormData) => void;
}

export const CustomFieldForm = ({ isOpen, onClose, onSave }: CustomFieldFormProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FieldFormData>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      type: 'text',
      required: false,
    },
  });

  const fieldType = watch('type');

  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const onSubmit = (data: FieldFormData) => {
    if (data.type === 'select') {
      data.options = options;
    }
    onSave(data);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add Custom Field"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Field Name
          </label>
          <input
            {...register('name')}
            className="form-control mt-1"
            placeholder="Enter field name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Field Type
          </label>
          <select
            {...register('type')}
            className="form-control mt-1"
            onChange={(e) => {
              setShowOptions(e.target.value === 'select');
            }}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="select">Select</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('required')}
            className="h-4 w-4 text-blue-600 rounded border-gray-300"
          />
          <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Required Field
          </label>
        </div>

        {showOptions && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Options
            </label>
            <div className="mt-1 space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="form-control"
                  placeholder="Add option"
                />
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="btn"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <span>{option}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
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
            Add Field
          </button>
        </div>
      </form>
    </Dialog>
  );
};