import { Middleware } from '@reduxjs/toolkit';
import debounce from 'lodash/debounce';

const FORM_STORAGE_KEY = 'wellnessForm';

// Save form changes to localStorage
const saveState = debounce((state: any) => {
  try {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Could not save state', err);
  }
}, 1000);

export const formPersistenceMiddleware: Middleware = (store) => (next: any) => (action: any) => {
  const result = next(action);
  
  // Only save specific actions that modify form data
  if (
    action.type.startsWith('wellness/') && 
    !action.type.includes('loading') &&
    !action.type.includes('error')
  ) {
    const state = store.getState().wellness;
    saveState(state);
  }
  
  return result;
}; 