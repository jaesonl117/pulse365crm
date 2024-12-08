import { nanoid } from 'nanoid';

const usedIds = new Set<string>();

export const generateId = (prefix: string = ''): string => {
  let id: string;
  do {
    id = `${prefix}${nanoid(10)}`;
  } while (usedIds.has(id));
  
  usedIds.add(id);
  return id;
};

export const releaseId = (id: string) => {
  // Mark as deleted but never remove from set to prevent reuse
  usedIds.add(`deleted_${id}`);
};