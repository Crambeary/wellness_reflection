import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer';

interface WellnessState {
  isLoading: boolean;
  lastUpdated: string;
  name: string;
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
  lastUpdated: "",
  name: "",
  date: "",
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
  initialState,
  reducers: {
    updateField(state, action: PayloadAction<{ id: keyof WellnessState | string; value: string | number }>) {
      const { id, value } = action.payload;
      (state as any)[id] = value;
      state.lastUpdated = new Date().toISOString();
    },
    clearForm(state) {
      const name = state.name;
      return { ...initialState, isLoading: false, lastUpdated: new Date().toISOString(), name: name };
    },
    loadSavedForm(state, action: PayloadAction<WellnessState>) {
      const name = state.name;
      return { ...state, ...action.payload, lastUpdated: new Date().toISOString(), name: name };
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    incrementField: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (typeof (state as any)[id] === 'number' && (state as any)[id] < 5) {
        (state as any)[id] = (state as any)[id] + 1;
        state.lastUpdated = new Date().toISOString();
      }
    },
    decrementField: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (typeof (state as any)[id] === 'number' && (state as any)[id] > 0) {
        (state as any)[id] = (state as any)[id] - 1;
        state.lastUpdated = new Date().toISOString();
      }
    },
    setFieldValue: (state, action: PayloadAction<{ id: keyof WellnessState | string; value: number | string }>) => {
      const { id, value } = action.payload;
      if (typeof (state as any)[id] === 'number') {
        const numValue = Number(value);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
          (state as any)[id] = numValue;
          state.lastUpdated = new Date().toISOString();
        }
      } else {
        (state as any)[id] = value;
        state.lastUpdated = new Date().toISOString();
      }
    },
    getDate: (state: WritableDraft<WellnessState>): WellnessState => {
      // Your logic here
      // For example, modifying the state directly
      // state.date = new Date().toISOString();
      return state; // Ensure it returns the modified state
    }
  },
});

export const { 
  updateField, 
  clearForm, 
  loadSavedForm, 
  setLoading,
  incrementField,
  decrementField,
  setFieldValue,
  getDate
} = wellnessSlice.actions;
export default wellnessSlice.reducer;
