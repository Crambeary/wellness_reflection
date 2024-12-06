import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WellnessState {
  name: string;
  date: string;
  'wake-time': string;
  qotd: string;
  hydration: string;
  'morning-vitality': string;
  'afternoon-vitality': string;
  'evening-vitality': string;
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
  name: "",
  date: "",
  'wake-time': "",
  qotd: "",
  hydration: "",
  'morning-vitality': "",
  'afternoon-vitality': "",
  'evening-vitality': "",
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
    updateField: (state, action: PayloadAction<{ name: string; value: string }>) => {
      const { name, value } = action.payload;
      (state as any)[name] = value;
    },
    clearForm: (state) => {
      Object.assign(state, initialState);
    },
    loadSavedForm: (state, action: PayloadAction<WellnessState>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { updateField, clearForm, loadSavedForm } = wellnessSlice.actions;
export default wellnessSlice.reducer;
