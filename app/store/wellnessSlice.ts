import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { getLocalISOString } from '@/utils/helpers'
export interface WellnessState {
  isLoading: boolean;
  isAuthenticated: boolean;
  saveButton: {
    text: 'Submit' | 'Saving...' | 'Saved' | 'Error';
    icon: IconDefinition;
    variant: 'primary' | 'outline-primary' | 'outline-success' | 'outline-danger';
  };
  errorMessage: string;
  showModal: boolean;
  modalMessage: {
    title: string;
    body: string;
    footer: 'unauthenticated' | 'unsaved' | 'logout' | 'clearing' | '';
  };
  lastUpdated: string;
  wasViewingClients: boolean;
  isDiverged: boolean;
  targetDate: string | null;
  isCoach: boolean;
  name: string;
  userId: string;
  email: string;
  date: string;
  'wake-time': string;
  'bedtime': string;
  qotd: string;
  hydration: number;
  'morning-vitality': number;
  'afternoon-vitality': number;
  'evening-vitality': number;
  'morning-meals': string;
  'morning-meals-notes': string;
  'morning-meals-cravings': string;
  'afternoon-meals': string;
  'afternoon-meals-notes': string;
  'afternoon-meals-cravings': string;
  'evening-meals': string;
  'evening-meals-notes': string;
  'evening-meals-cravings': string;
  'morning-activity': string;
  'afternoon-activity': string;
  'evening-activity': string;
}

const initialState: WellnessState = {
  isLoading: true,
  isAuthenticated: false,
  saveButton: {
    text: "Submit",
    icon: faSave,
    variant: 'primary',
  },
  errorMessage: "",
  showModal: false,
  modalMessage: {
    title: "",
    body: "",
    footer: ''
  },
  lastUpdated: "",
  wasViewingClients: false,
  isDiverged: false,
  targetDate: null,
  isCoach: false,
  name: "",
  userId: "",
  email: "",
  date: getLocalISOString().split(' ')[0],
  'wake-time': "",
  'bedtime': "",
  qotd: "",
  hydration: 0,
  'morning-vitality': 0,
  'afternoon-vitality': 0,
  'evening-vitality': 0,
  'morning-meals': "",
  'morning-meals-notes': "",
  'morning-meals-cravings': "",
  'afternoon-meals': "",
  'afternoon-meals-notes': "",
  'afternoon-meals-cravings': "",
  'evening-meals': "",
  'evening-meals-notes': "",
  'evening-meals-cravings': "",
  'morning-activity': "",
  'afternoon-activity': "",
  'evening-activity': "",
};

export const wellnessSlice = createSlice({
  name: 'wellness',
  initialState: (() => {
    if (typeof window === 'undefined') return initialState;
    
    const saved = localStorage.getItem('wellnessForm');
    return saved ? JSON.parse(saved) : initialState;
  })(),
  reducers: {
    updateField(state, action: PayloadAction<{ id: keyof WellnessState | string; value: string | number }>) {
      const { id, value } = action.payload;
      (state as any)[id] = value;
      state.lastUpdated = new Date().toISOString();
      state.isDiverged = true;
    },
    clearForm(state) {
      localStorage.removeItem('wellnessForm');
      const name = state.name;
      const date = state.date;
      const isAuthenticated = state.isAuthenticated;
      const email = state.email;
      return { ...initialState, isLoading: false, lastUpdated: new Date().toISOString(), name: name, date: date, isAuthenticated: isAuthenticated, isDiverged: false, email: email };
    },
    clearName(state) {
      return {...state, name: ''}
    },
    loadSavedForm(state, action: PayloadAction<WellnessState>) {
      const name = state.name;
      const email = state.email;
      const isAuthenticated = state.isAuthenticated;
      const isDiverged = state.isDiverged;
      const isCoach = state.isCoach;
      const lastUpdated = action.payload.lastUpdated || new Date().toISOString();
      return { ...state, ...action.payload, lastUpdated: lastUpdated, name: name, email: email, isAuthenticated: isAuthenticated, isDiverged: isDiverged, isCoach: isCoach };
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    incrementField: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (typeof (state as any)[id] === 'number' && (state as any)[id] < 5) {
        (state as any)[id] = (state as any)[id] + 1;
        state.lastUpdated = new Date().toISOString();
        state.isDiverged = true;
      }
    },
    decrementField: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (typeof (state as any)[id] === 'number' && (state as any)[id] > 0) {
        (state as any)[id] = (state as any)[id] - 1;
        state.lastUpdated = new Date().toISOString();
        state.isDiverged = true;
      }
    },
    setFieldValue: (state, action: PayloadAction<{ id: keyof WellnessState | string; value: number | string }>) => {
      const { id, value } = action.payload;
      if (typeof (state as any)[id] === 'number') {
        const numValue = Number(value);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
          (state as any)[id] = numValue;
          state.lastUpdated = new Date().toISOString();
          state.isDiverged = true;
        }
      } else {
        (state as any)[id] = value;
        state.lastUpdated = new Date().toISOString();
        state.isDiverged = true;
      }
    },
    setDate: (state: WritableDraft<WellnessState>, action: PayloadAction<string>): WellnessState => {
      state.date = action.payload;
      return state;     
    },
    setSaveButton: (state, action: PayloadAction<{ text: 'Submit' | 'Saving...' | 'Saved' | 'Error'; icon: IconDefinition; variant: 'primary' | 'outline-primary' | 'outline-success' | 'outline-danger' }>) => {
      state.saveButton = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    setShowModal: (state, action: PayloadAction<boolean>) => {
      state.showModal = action.payload;
    },
    setModalMessage: (state, action: PayloadAction<{ title: string; body: string; footer: 'unauthenticated' | 'unsaved' | 'logout' | 'clearing' | '' }>) => {
      state.modalMessage = action.payload;
    },
    setIsDiverged: (state, action: PayloadAction<boolean>) => {
      state.isDiverged = action.payload;
    },
    setTargetDate: (state, action: PayloadAction<string | null>) => {
      state.targetDate = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setIsCoach: (state, action: PayloadAction<boolean>) => {
      state.isCoach = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setWasViewingClients: (state, action: PayloadAction<boolean>) => {
      state.wasViewingClients = action.payload;
    }
  },
});

export const { 
  updateField, 
  clearForm, 
  clearName,
  loadSavedForm, 
  setLoading,
  incrementField,
  decrementField,
  setFieldValue,
  setDate,
  setSaveButton,
  setErrorMessage,
  setShowModal,
  setModalMessage,
  setIsDiverged,
  setTargetDate,
  setIsAuthenticated,
  setEmail,
  setName,
  setIsCoach,
  setUserId,
  setWasViewingClients
} = wellnessSlice.actions;
export default wellnessSlice.reducer;
