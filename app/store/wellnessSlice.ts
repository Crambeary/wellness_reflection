import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WellnessState {
  isLoading: boolean;
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
  isLoading: true,
  name: "",
  date: "",
  'wake-time': "",
  qotd: "",
  hydration: "0",
  'morning-vitality': "0",
  'afternoon-vitality': "0",
  'evening-vitality': "0",
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
    updateField(state, action: PayloadAction<{ id: string; value: string }>) {
      const { id, value } = action.payload;
      (state as any)[id] = value;
    },
    clearForm(state) {
      return { ...initialState, isLoading: false };
    },
    loadSavedForm: (state, action: PayloadAction<WellnessState>) => {
      return { ...action.payload, isLoading: false };
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { updateField, clearForm, loadSavedForm, setLoading } = wellnessSlice.actions;
export default wellnessSlice.reducer;
