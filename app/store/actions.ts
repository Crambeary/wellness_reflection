import { createAsyncThunk } from '@reduxjs/toolkit';
import { getSelectedReflection } from '@/utils/supabase/database';
import { loadSavedForm, setLoading } from './wellnessSlice';
import { createClient } from '@/utils/supabase/client';
import { setDate as setDateAction } from './wellnessSlice';
import { mapReflectionToState } from '@/utils/mappers';

export const setDate = createAsyncThunk(
    'wellness/setDate',
    async (date: string, { dispatch }) => { 
        console.log(date);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error('User not authenticated');
            return;
        }
        dispatch(setLoading(true));
        const response = await getSelectedReflection(user.id, date);
        dispatch(setDateAction(response.reflection.date));
        dispatch(loadSavedForm(mapReflectionToState(response.reflection)));
        dispatch(setLoading(false));
    }
);