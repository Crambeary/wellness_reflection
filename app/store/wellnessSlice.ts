import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WellnessState {
  isLoading: boolean;
  name: string;
  date: string;
  'wake-time': string;
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
  name: "",
  date: "",
  'wake-time': "",
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
  'evening-activity': ""
};

export const wellnessSlice = createSlice({
  name: 'wellness',
  initialState,
  reducers: {
    updateField(state, action: PayloadAction<{ id: keyof WellnessState; value: string | number }>) {
      const { id, value } = action.payload;
      (state as any)[id] = value as WellnessState[typeof id];
    },
    clearForm(state) {
      return { ...initialState, isLoading: false };
    },
    loadSavedForm(state, action: PayloadAction<WellnessState>) {
      return action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    incrementField: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (typeof (state as any)[id] === 'number' && (state as any)[id] < 5) {
        (state as any)[id] = (state as any)[id] + 1;
      }
    },
    decrementField: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (typeof (state as any)[id] === 'number' && (state as any)[id] > 0) {
        (state as any)[id] = (state as any)[id] - 1;
      }
    },
    setFieldValue: (state, action: PayloadAction<{ id: keyof WellnessState | string; value: number | string }>) => {
      const { id, value } = action.payload;
      if (typeof (state as any)[id] === 'number') {
        const numValue = Number(value);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
          (state as any)[id] = numValue;
        }
      } else {
        (state as any)[id] = value;
      }
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
  setFieldValue
} = wellnessSlice.actions;
export default wellnessSlice.reducer;
