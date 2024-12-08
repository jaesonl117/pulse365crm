import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  options?: string[];
  order: number;
  value?: string | number | Date;
}

interface CustomFieldsState {
  fields: CustomField[];
  addField: (field: Omit<CustomField, 'id' | 'order'>) => void;
  removeField: (id: string) => void;
  updateField: (id: string, field: Partial<CustomField>) => void;
  updateFieldOrder: (id: string, newOrder: number) => void;
  updateFieldValue: (id: string, value: string | number | Date) => void;
}

export const useCustomFieldsStore = create<CustomFieldsState>()(
  persist(
    (set) => ({
      fields: [],
      addField: (field) => set((state) => ({
        fields: [...state.fields, { 
          ...field, 
          id: `field_${Date.now()}`,
          order: state.fields.length,
          value: undefined
        }],
      })),
      removeField: (id) => set((state) => ({
        fields: state.fields.filter((field) => field.id !== id),
      })),
      updateField: (id, updatedField) => set((state) => ({
        fields: state.fields.map((field) =>
          field.id === id ? { ...field, ...updatedField } : field
        ),
      })),
      updateFieldOrder: (id, newOrder) => set((state) => ({
        fields: state.fields.map((field) => {
          if (field.id === id) {
            return { ...field, order: newOrder };
          }
          if (field.order >= newOrder) {
            return { ...field, order: field.order + 1 };
          }
          return field;
        }).sort((a, b) => a.order - b.order),
      })),
      updateFieldValue: (id, value) => set((state) => ({
        fields: state.fields.map((field) =>
          field.id === id ? { ...field, value } : field
        ),
      })),
    }),
    {
      name: 'custom-fields-storage',
    }
  )
);